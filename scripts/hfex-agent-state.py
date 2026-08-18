#!/usr/bin/env python3
"""Experience Layer adaptation of agent-state."""

from __future__ import annotations

import argparse
import fcntl
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone, timedelta
from pathlib import Path

# ─── internal helpers ────────────────────────────────────────────────────────

_VALID_ROLES = ("planning", "implementation", "reviewer", "toolsmith", "codie", "aibo", "cvo", "uiux")
# Canonical role personas: the checkpoint restores state, the persona restores
# behavior. Personas are committed, provider-neutral, and never copied here —
# only the path and a content hash, so a resume can prove which persona
# version the session behaves under and warn when the file moved on.
_PERSONA_BY_ROLE = {
    "bang_esb": ".agent-personas/bang_esb.md",
    "hospitality_fine_dining": ".agent-personas/hospitality_fine_dining.md",
    "jony_ive": ".agent-personas/jony_ive.md",
    "koh_retail": ".agent-personas/koh_retail.md",
    "pesimis": ".agent-personas/pesimis.md",
    "uber_food_uiux": ".agent-personas/uber_food_uiux.md",
}


def _persona_file(role: str | None) -> Path | None:
    """Absolute path of the canonical persona for *role*, or None."""
    rel = _PERSONA_BY_ROLE.get(role or "")
    if not rel:
        return None
    common = _git_common_dir(Path.cwd())
    return common.parent / rel


def _persona_sha(role: str | None) -> str | None:
    """Short content hash of the role's canonical persona, or None if absent."""
    import hashlib
    path = _persona_file(role)
    if path is None or not path.is_file():
        return None
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]
_VALID_SLOTS = ("planning1",
                "implementation1", "implementation2", "implementation3",
                "implementation4", "implementation5",
                "reviewer1", "codie1", "aibo1", "cvo1", "uiux1")
_EVENTS_MAX = 50  # how many recent events resume shows


def _utc_now() -> str:
    """ISO-8601 UTC timestamp."""
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _git_common_dir(worktree: Path) -> Path:
    """Resolve the shared Git common directory via a Git-native query.

    In a linked worktree, ``.git`` is a *file* (not a directory), so manual
    ``.git/commondir`` parsing fails. ``git rev-parse --git-common-dir``
    handles all layouts correctly. Falls back to ``worktree / .git`` when Git
    is unavailable.
    """
    result = _git("rev-parse --git-common-dir", worktree)
    if result:
        p = Path(result)
        if not p.is_absolute():
            p = (worktree / p).resolve()
        return p
    return (worktree / ".git").resolve()


def _state_root() -> Path:
    """The ``.agent-state`` directory at the clone root."""
    worktree = Path.cwd()
    common = _git_common_dir(worktree)
    # common dir is .../repo/.git for the primary clone
    clone_root = common.parent
    return clone_root / ".agent-state"


def _agents_dir() -> Path:
    return _state_root() / "agents"


def _events_file() -> Path:
    return _state_root() / "events.jsonl"


def _claims_file() -> Path:
    return _state_root() / "claims.json"


def _checkpoint_path(slot: str) -> Path:
    return _agents_dir() / f"{slot}.json"


def _atomic_write_json(path: Path, data: dict) -> None:
    """Atomically write *data* as JSON to *path*.

    Uses a temp file + ``os.replace`` + ``fsync`` of both the file and its
    parent directory so a crash mid-write leaves the prior valid checkpoint
    intact.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            json.dump(data, f, sort_keys=True)
            f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, str(path))
        # fsync the directory so the rename is durable
        dir_fd = os.open(str(path.parent), os.O_RDONLY)
        try:
            os.fsync(dir_fd)
        finally:
            os.close(dir_fd)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


# ─── git metadata (read-only, safe fields only) ──────────────────────────────

def _git(field: str, cwd: Path | None = None) -> str | None:
    """Run a read-only Git command and return its stdout (stripped) or None."""
    try:
        result = subprocess.run(
            ["git"] + field.split(),
            capture_output=True, text=True, check=False,
            cwd=str(cwd) if cwd else None,
        )
        if result.returncode == 0:
            return result.stdout.strip()
    except (OSError, subprocess.SubprocessError):
        pass
    return None


def _git_state() -> dict:
    """Collect safe, read-only Git metadata. Never captures env or secrets."""
    worktree = Path.cwd()
    return {
        "branch": _git("rev-parse --abbrev-ref HEAD", worktree),
        "head_sha": _git("rev-parse --short HEAD", worktree),
        "main_sha": _git("rev-parse --short origin/main", worktree),
        "dirty": bool(_git("status --porcelain", worktree)),
        "behind_main": _git("rev-list --count HEAD..origin/main", worktree),
    }


# ─── subcommands ─────────────────────────────────────────────────────────────

def cmd_checkpoint(args: argparse.Namespace) -> int:
    """Write or replace this agent's checkpoint atomically."""
    if args.slot not in _VALID_SLOTS:
        print(f"error: invalid slot '{args.slot}'", file=sys.stderr)
        return 2
    if args.role not in _VALID_ROLES:
        print(f"error: invalid role '{args.role}'", file=sys.stderr)
        return 2

    git = _git_state()
    now = _utc_now()

    checkpoint = {
        "slot": args.slot,
        "role": args.role,
        "provider": args.provider or "",
        # Slot ≠ session: different sessions (different IDEs/providers)
        # rotate through one slot lane. The session id is what analytics
        # joins on to attribute good/bad work to the actual occupant.
        "session": getattr(args, "session", "") or "",
        "updated_at": now,
        "git": git,
    }
    # Record which persona version this session behaves under (path + hash,
    # never the content) so resume can detect a persona that moved on.
    persona_sha = _persona_sha(args.role)
    if persona_sha:
        checkpoint["persona"] = _PERSONA_BY_ROLE[args.role]
        checkpoint["persona_sha"] = persona_sha
    # Optional short recovery fields — caller supplies these explicitly
    if args.issue:
        checkpoint["issue"] = args.issue
    if args.branch:
        checkpoint["branch"] = args.branch
    if args.objective:
        checkpoint["objective"] = args.objective
    if args.notes:
        checkpoint["notes"] = args.notes

    path = _checkpoint_path(args.slot)
    _atomic_write_json(path, checkpoint)
    print(f"checkpoint written: {args.slot} → {path}")
    return 0


def _load_claims() -> dict:
    claims_file = _claims_file()
    if not claims_file.is_file():
        return {}
    try:
        with open(claims_file, "r") as f:
            fcntl.flock(f.fileno(), fcntl.LOCK_SH)
            try:
                return json.load(f)
            finally:
                fcntl.flock(f.fileno(), fcntl.LOCK_UN)
    except (OSError, json.JSONDecodeError):
        return {}


def _append_event(slot: str, kind: str, message: str = "", work_unit: str | None = None, payload: dict | None = None) -> None:
    event = {
        "timestamp": _utc_now(),
        "slot": slot,
        "kind": kind,
    }
    if work_unit:
        event["work_unit_id"] = work_unit
    if message:
        event["message"] = message[:500]
    if payload:
        event["payload"] = payload

    events = _events_file()
    events.parent.mkdir(parents=True, exist_ok=True)

    with open(events, "a") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.write(json.dumps(event, sort_keys=True) + "\n")
            f.flush()
            os.fsync(f.fileno())
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)


def cmd_event(args: argparse.Namespace) -> int:
    """Append a short JSONL event to the shared log under flock."""
    _append_event(args.slot, args.kind, getattr(args, "message", "") or "")
    print(f"event appended: {args.slot} {args.kind}")
    return 0


def cmd_log_event(args: argparse.Namespace) -> int:
    """Subcommand: log a structured activity event to .agent-state/events.jsonl."""
    payload = None
    if getattr(args, "payload", None):
        try:
            payload = json.loads(args.payload)
        except json.JSONDecodeError as err:
            print(f"error: invalid JSON payload: {err}", file=sys.stderr)
            return 2

    _append_event(
        slot=args.slot,
        kind=args.kind,
        message=getattr(args, "message", "") or "",
        work_unit=getattr(args, "work_unit", None),
        payload=payload,
    )
    wu_str = f" ({args.work_unit})" if getattr(args, "work_unit", None) else ""
    print(f"event logged: {args.slot} {args.kind}{wu_str}")
    return 0


def cmd_claim(args: argparse.Namespace) -> int:
    """Acquire a lease-based WorkUnit claim in .agent-state/claims.json."""
    work_unit = args.work_unit.strip()
    if not work_unit:
        print("error: --work-unit cannot be empty", file=sys.stderr)
        return 2

    if work_unit.isdigit():
        work_unit = f"L2-{work_unit}"

    now_dt = datetime.now(timezone.utc)
    now_iso = now_dt.isoformat(timespec="seconds")
    lease_hours = float(args.lease_hours) if getattr(args, "lease_hours", None) else 4.0
    expires_dt = now_dt.replace(microsecond=0) + timedelta(hours=lease_hours)
    expires_iso = expires_dt.isoformat(timespec="seconds")

    git = _git_state()

    claims_file = _claims_file()
    claims_file.parent.mkdir(parents=True, exist_ok=True)

    with open(claims_file, "a+") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.seek(0)
            content = f.read()
            claims = json.loads(content) if content.strip() else {}

            existing = claims.get(work_unit)
            if existing and not getattr(args, "force", False):
                exp_str = existing.get("lease_expires_at", "")
                try:
                    exp_dt = datetime.fromisoformat(exp_str)
                except (ValueError, TypeError):
                    exp_dt = None

                if exp_dt and exp_dt > now_dt and existing.get("slot") != args.slot:
                    owner_sig = existing.get("owner_signature", existing.get("slot", "?"))
                    print(f"error: work unit {work_unit} is already leased by '{owner_sig}' "
                          f"until {exp_str} (pass --force to override)", file=sys.stderr)
                    return 1

            provider = getattr(args, "provider", "") or ""
            session = getattr(args, "session", "") or ""
            role = getattr(args, "role", "") or ""
            
            if args.slot.lower() == "auto":
                candidates = [f"implementation{i}" for i in range(1, 6)] if (not role or role == "implementation") else [f"{role}1"]
                assigned_slot = None
                for cand in candidates:
                    busy = False
                    for wu, claim in claims.items():
                        if claim.get("slot") == cand:
                            exp_str = claim.get("lease_expires_at", "")
                            try:
                                exp_dt = datetime.fromisoformat(exp_str)
                                if exp_dt > now_dt:
                                    busy = True
                                    break
                            except (ValueError, TypeError):
                                pass
                    if not busy:
                        assigned_slot = cand
                        break
                slot = assigned_slot or candidates[0]
            else:
                slot = args.slot

            sess_str = f"{provider}:{session}" if (provider and session) else (session or provider or "?")
            owner_sig = f"[{slot}:{role or '?'} | {sess_str}]"

            claims[work_unit] = {
                "work_unit_id": work_unit,
                "slot": slot,
                "role": role,
                "provider": provider,
                "session": session,
                "owner_signature": owner_sig,
                "base_sha": git.get("head_sha", ""),
                "claimed_at": now_iso,
                "lease_expires_at": expires_iso,
            }

            _atomic_write_json(claims_file, claims)
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)

    _append_event(slot, "CLAIMED", f"WorkUnit {work_unit} leased until {expires_iso}", work_unit=work_unit)
    print(f"claim acquired: {work_unit} → slot {slot} (lease expires {expires_iso})")
    return 0


def cmd_release(args: argparse.Namespace) -> int:
    """Release a WorkUnit claim in .agent-state/claims.json."""
    work_unit = args.work_unit.strip()
    if work_unit.isdigit():
        work_unit = f"L2-{work_unit}"

    claims_file = _claims_file()
    if not claims_file.is_file():
        print(f"no active claims for {work_unit}")
        return 0

    with open(claims_file, "a+") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.seek(0)
            content = f.read()
            claims = json.loads(content) if content.strip() else {}
            if work_unit in claims:
                del claims[work_unit]
                _atomic_write_json(claims_file, claims)
                print(f"claim released: {work_unit}")
            else:
                print(f"work unit {work_unit} was not active")
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)

    _append_event(args.slot, "RELEASED", f"WorkUnit {work_unit} released by {args.slot}", work_unit=work_unit)
    return 0


def cmd_claims(args: argparse.Namespace) -> int:
    """Read-only listing of all active work unit leases."""
    claims = _load_claims()
    now_dt = datetime.now(timezone.utc)
    rows = []
    for wu_id, claim in sorted(claims.items()):
        exp_str = claim.get("lease_expires_at", "")
        try:
            exp_dt = datetime.fromisoformat(exp_str)
            expired = exp_dt <= now_dt
        except (ValueError, TypeError):
            expired = False
        status = "EXPIRED" if expired else "ACTIVE"
        sig = claim.get("owner_signature") or f"[{claim.get('slot', '?')}]"
        rows.append(f"  {wu_id:12s} {status:8s} owner={sig} expires={exp_str}")

    print(f"CLAIMS ({len(rows)})" if rows else "CLAIMS: none")
    for r in rows:
        print(r)
    return 0


def cmd_audit_realization(args):
    print("⚠️  audit realization is not available in Experience Layer.")
    print("   Use headless-company-books/scripts/agent-state.py for Engine audits.")
def cmd_audit_code_hygiene(args):
    print("⚠️  audit code hygiene is not available in Experience Layer.")
    print("   Use headless-company-books/scripts/agent-state.py for Engine audits.")
def cmd_audit_modularity(args):
    print("⚠️  audit modularity is not available in Experience Layer.")
    print("   Use headless-company-books/scripts/agent-state.py for Engine audits.")
def cmd_resume(args: argparse.Namespace) -> int:
    """Read-only: report this agent's checkpoint, peers, events, and Git state.

    Performs NO Git mutation whatsoever.
    """
    agents_dir = _agents_dir()
    events_file = _events_file()
    git = _git_state()
    now = _utc_now()

    # ── this agent ──────────────────────────────────────────────────────────
    own_path = _checkpoint_path(args.slot)
    own = None
    if own_path.is_file():
        try:
            own = json.loads(own_path.read_text())
        except (json.JSONDecodeError, OSError):
            own = None

    # ── peers ───────────────────────────────────────────────────────────────
    peers = []
    if agents_dir.is_dir():
        for p in sorted(agents_dir.glob("*.json")):
            if p.name == f"{args.slot}.json":
                continue
            try:
                peer = json.loads(p.read_text())
                peers.append({
                    "slot": peer.get("slot", p.stem),
                    "role": peer.get("role", "?"),
                    "updated_at": peer.get("updated_at", "?"),
                    "issue": peer.get("issue"),
                    "branch": peer.get("branch"),
                })
            except (json.JSONDecodeError, OSError):
                peers.append({"slot": p.stem, "error": "unreadable"})

    # ── recent events ───────────────────────────────────────────────────────
    recent_events = []
    if events_file.is_file():
        try:
            lines = events_file.read_text().splitlines()
            recent_events = [json.loads(l) for l in lines[-_EVENTS_MAX:] if l.strip()]
        except (OSError, json.JSONDecodeError):
            recent_events = []

    # ── warnings ────────────────────────────────────────────────────────────
    warnings = []
    if own is None:
        warnings.append("no checkpoint found — first run or state was cleared")
    else:
        checkpoint_branch = own.get("branch")
        if checkpoint_branch and checkpoint_branch != git["branch"]:
            warnings.append(
                f"branch mismatch: checkpoint says '{checkpoint_branch}' "
                f"but HEAD is on '{git['branch']}'"
            )
        if own.get("issue") and args.issue and own["issue"] != args.issue:
            warnings.append(
                f"issue mismatch: checkpoint says #{own['issue']} "
                f"but resume was asked for #{args.issue}"
            )
        if git["behind_main"] and git["behind_main"] != "0":
            warnings.append(f"behind origin/main by {git['behind_main']} commits")

    if git["dirty"]:
        warnings.append("worktree is dirty — uncommitted changes exist")
    if git["main_sha"] is None:
        warnings.append("origin/main not found — cannot determine drift")

    # ── canonical persona (behavior anchor) ─────────────────────────────────
    role = (own or {}).get("role") or next(
        (r for r in _VALID_ROLES if args.slot.startswith(r)), None)
    persona = _PERSONA_BY_ROLE.get(role or "")
    current_sha = _persona_sha(role) if persona else None
    recorded_sha = (own or {}).get("persona_sha")
    if recorded_sha and current_sha and recorded_sha != current_sha:
        warnings.append(
            f"persona changed since this checkpoint "
            f"(recorded {recorded_sha}, current {current_sha}) — "
            f"reload {persona} before continuing"
        )

    # ── checkpoint age ──────────────────────────────────────────────────────
    checkpoint_age = None
    if own and "updated_at" in own:
        try:
            then = datetime.fromisoformat(own["updated_at"])
            delta = datetime.now(timezone.utc) - then
            checkpoint_age = f"{int(delta.total_seconds())}s ({delta})"
            if delta.total_seconds() > 3600:
                warnings.append(f"checkpoint is {int(delta.total_seconds() / 3600)}h old")
        except (ValueError, TypeError):
            checkpoint_age = "unknown"

    # ── print report ────────────────────────────────────────────────────────
    print("=" * 60)
    print(f"AGENT RESUME — slot: {args.slot}")
    print("=" * 60)

    if own:
        print(f"\n## This agent")
        print(f"  role:       {own.get('role', '?')}")
        print(f"  provider:   {own.get('provider', '(none)') or '(none)'}")
        if own.get("session"):
            print(f"  session:    {own['session']}")
        print(f"  updated:    {own.get('updated_at', '?')}")
        print(f"  age:        {checkpoint_age or '?'}")
        if own.get("issue"):
            print(f"  issue:      #{own['issue']}")
        if own.get("branch"):
            print(f"  branch:     {own['branch']}")
        if own.get("objective"):
            print(f"  objective:  {own['objective']}")
        if own.get("notes"):
            print(f"  notes:      {own['notes']}")
    else:
        print("\n## This agent: NO CHECKPOINT")

    print(f"\n## Git state")
    print(f"  branch:     {git['branch']}")
    print(f"  HEAD:       {git['head_sha']}")
    print(f"  origin/main: {git['main_sha']}")
    print(f"  dirty:      {'yes' if git['dirty'] else 'no'}")
    if git["behind_main"]:
        print(f"  behind:     {git['behind_main']} commits")

    if peers:
        print(f"\n## Peer agents ({len(peers)})")
        for p in peers:
            line = f"  {p.get('slot', '?'):20s} role={p.get('role', '?'):14s}"
            if p.get("issue"):
                line += f" #{p['issue']}"
            if p.get("branch"):
                line += f" [{p['branch']}]"
            if p.get("updated_at"):
                age, label = _freshness(p["updated_at"])
                line += f" {label} age={age}"
            print(line)
    else:
        print(f"\n## Peer agents: none")

    if recent_events:
        print(f"\n## Recent events (last {len(recent_events)})")
        for e in recent_events:
            ts = e.get("timestamp", "?")[:19]
            slot = e.get("slot", "?")
            kind = e.get("kind", "?")
            msg = e.get("message", "")
            line = f"  {ts}  {slot:20s} {kind}"
            if msg:
                line += f" — {msg}"
            print(line)
    else:
        print(f"\n## Recent events: none")

    if warnings:
        print(f"\n## ⚠ Warnings ({len(warnings)})")
        for w in warnings:
            print(f"  • {w}")
    else:
        print(f"\n## Warnings: none")

    if persona:
        print(f"\n## Persona")
        print(f"  load {persona} FIRST — the checkpoint restores state;")
        print(f"  the persona restores behavior (see .agent-personas/README.md)")
        if current_sha:
            print(f"  current version: {current_sha}"
                  + (f" (checkpointed under {recorded_sha})" if recorded_sha else ""))

    print("\n" + "=" * 60)
    print("Reminder: GitHub/Issue/Project remain authority.")
    print("State is recovery-only; resume performed no Git mutation.")
    print("=" * 60)
    return 0


# Heartbeat contract: while actively working, agents checkpoint at least this
# often, so a fresher checkpoint than this reads as an occupied slot. Nothing
# here can prove a *process* is alive — only how recently one proved it was.
_ACTIVE_SECONDS = 30 * 60
_STALE_SECONDS = 24 * 3600


def _freshness(updated_at: str) -> tuple[str, str]:
    """(age text, label) for a checkpoint timestamp."""
    try:
        then = datetime.fromisoformat(updated_at)
    except (ValueError, TypeError):
        return ("?", "UNKNOWN")
    seconds = int((datetime.now(timezone.utc) - then).total_seconds())
    if seconds < 0:
        return ("clock-skew", "UNKNOWN")
    if seconds < 3600:
        age = f"{seconds // 60}m"
    elif seconds < _STALE_SECONDS:
        age = f"{seconds // 3600}h{(seconds % 3600) // 60:02d}m"
    else:
        age = f"{seconds // 86400}d"
    if seconds < _ACTIVE_SECONDS:
        return (age, "ACTIVE")
    if seconds < _STALE_SECONDS:
        return (age, "QUIET")
    return (age, "STALE")


def cmd_slots(args: argparse.Namespace) -> int:
    """Read-only: every slot checkpoint with age-based freshness labels."""
    agents_dir = _agents_dir()
    rows = []
    if agents_dir.is_dir():
        for p in sorted(agents_dir.glob("*.json")):
            try:
                data = json.loads(p.read_text())
            except (json.JSONDecodeError, OSError):
                rows.append(f"  {p.stem:20s} UNREADABLE")
                continue
            age, label = _freshness(data.get("updated_at", ""))
            slot = data.get("slot", p.stem)
            role = data.get("role", "?")
            provider = data.get("provider", "")
            session = data.get("session", "")
            if session and provider and session.startswith(f"{provider}:"):
                sess_str = session
            elif provider and session:
                sess_str = f"{provider}:{session}"
            else:
                sess_str = session or provider or "?"
            sig = f"[{slot}:{role} | {sess_str}]"
            line = f"  {sig:50s} {label:7s} age={age:8s}"
            if data.get("issue"):
                line += f" #{data['issue']}"
            if data.get("branch"):
                line += f" [{data['branch']}]"
            rows.append(line)
    print(f"SLOTS ({len(rows)})" if rows else "SLOTS: none")
    for line in rows:
        print(line)
    print()
    print(f"A checkpoint proves liveness only as of its timestamp.")
    print(f"  ACTIVE  = heartbeat within {_ACTIVE_SECONDS // 60}m (the cadence agents keep while working)")
    print(f"  QUIET   = parked, between checkpoints, or dead — cannot tell from here")
    print(f"  STALE   = older than {_STALE_SECONDS // 3600}h; presume abandoned")
    print("Before reclaiming a slot, verify against the provider's own session/task")
    print("list and the Issue's execution lock — never from age alone.")
    return 0


# ─── CLI ─────────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Crash-resilient shared agent recovery state.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # checkpoint
    cp = sub.add_parser("checkpoint", help="atomically write/replace this agent's checkpoint")
    cp.add_argument("--slot", required=True, help="dispatcher-allocated slot ID (planning1, implementation1, ...)")
    cp.add_argument("--role", required=True, choices=_VALID_ROLES, help="agent role")
    cp.add_argument("--provider", default="", help="provider name (optional metadata)")
    cp.add_argument("--session", default="",
                    help="session id occupying the slot (e.g. codex:thread-..., "
                         "claude:sess_... ) — slots rotate sessions; analytics joins on this")
    cp.add_argument("--issue", default="", help="GitHub issue number (optional)")
    cp.add_argument("--branch", default="", help="Git branch (optional)")
    cp.add_argument("--objective", default="", help="short objective (optional)")
    cp.add_argument("--notes", default="", help="short recovery notes (optional)")
    cp.set_defaults(func=cmd_checkpoint)

    # event
    ev = sub.add_parser("event", help="append a coordination event")
    ev.add_argument("--slot", required=True, help="agent slot ID")
    ev.add_argument("--kind", required=True, help="event kind (e.g. started, paused, blocker)")
    ev.add_argument("--message", default="", help="short message (max 500 chars)")
    ev.set_defaults(func=cmd_event)

    # log-event
    le = sub.add_parser("log-event", help="append a structured activity event to .agent-state/events.jsonl")
    le.add_argument("--slot", required=True, help="agent slot ID")
    le.add_argument("--kind", required=True, help="event type (CLAIMED, FINDING, PR_OPENED, REVIEW_LOGGED, REALIZED, etc.)")
    le.add_argument("--work-unit", default="", help="optional WorkUnit ID")
    le.add_argument("--message", default="", help="short summary message")
    le.add_argument("--payload", default="", help="optional JSON payload string")
    le.set_defaults(func=cmd_log_event)

    # claim
    cl = sub.add_parser("claim", help="acquire lease-based WorkUnit ownership in .agent-state/claims.json")
    cl.add_argument("--work-unit", required=True, help="WorkUnit ID (e.g. L2-729 or 729)")
    cl.add_argument("--slot", required=True, help="agent slot ID")
    cl.add_argument("--role", default="", choices=_VALID_ROLES, help="agent role (optional)")
    cl.add_argument("--provider", default="", help="provider name (optional)")
    cl.add_argument("--session", default="", help="session ID (optional)")
    cl.add_argument("--lease-hours", type=float, default=4.0, help="lease duration in hours (default 4.0)")
    cl.add_argument("--force", action="store_true", help="force claim override if currently leased")
    cl.set_defaults(func=cmd_claim)

    # release
    rl = sub.add_parser("release", help="release a WorkUnit lease in .agent-state/claims.json")
    rl.add_argument("--work-unit", required=True, help="WorkUnit ID")
    rl.add_argument("--slot", required=True, help="agent slot ID")
    rl.set_defaults(func=cmd_release)

    # claims
    cms = sub.add_parser("claims", help="read-only: list all active WorkUnit claims")
    cms.set_defaults(func=cmd_claims)

    # audit-realization
    ar = sub.add_parser("audit-realization", help="audit feature realization status against main HEAD and evidence")
    ar.add_argument("--issue", default="", help="GitHub issue number")
    ar.add_argument("--plan-path", default="", help="path to L2 plan markdown file")
    ar.set_defaults(func=cmd_audit_realization)

    # audit-code-hygiene / check-debug-residue
    ach = sub.add_parser("audit-code-hygiene", aliases=["check-debug-residue"],
                         help="scan Rust service codebase for debug residue (eprintln!, dbg!, [DEBUG])")
    ach.add_argument("--strict", action="store_true", help="fail closed on any service eprintln/println print statements as well as [DEBUG]/dbg!")
    ach.set_defaults(func=cmd_audit_code_hygiene)

    # audit-modularity
    am = sub.add_parser("audit-modularity", help="audit Rust service codebase for 500-line modularity threshold per AGENTS.md")
    am.add_argument("--threshold", type=int, default=500, help="line count threshold for modularity review trigger (default 500)")
    am.set_defaults(func=cmd_audit_modularity)

    # resume
    sl = sub.add_parser("slots", help="read-only: list slots with freshness labels")
    sl.set_defaults(func=cmd_slots)

    rs = sub.add_parser("resume", help="read-only recovery report")
    rs.add_argument("--slot", required=True, help="agent slot ID")
    rs.add_argument("--issue", default="", help="expected issue number (for mismatch detection)")
    rs.set_defaults(func=cmd_resume)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
