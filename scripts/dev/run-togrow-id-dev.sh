#!/usr/bin/env bash
# --- Run ToGrow ID natively in development mode (#35 headless identity gate) ---
# Mirrors every runtime variable from the live account-togrow-demo-api container,
# then pivots the five that define a self-contained local origin:
#   APP_ENV=development  → CookieSettings::plaintext_dev (PR codex/dev-session-cookie-mode)
#   BIND_ADDRESS=127.0.0.1:3200 / PUBLIC_BASE_URL=http://127.0.0.1:3200
# Idempotent: skips if /readyz already answers. HCB2 consumes it via
# TOGROW_DISCOVERY_URL=http://127.0.0.1:3200/.well-known/openid-configuration.
set -euo pipefail

POS_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TG_ROOT="${HFE_TG_ROOT:-$POS_ROOT/../account-togrow}"
PORT="${TOGROW_DEV_PORT:-3200}"

log() { printf '\n\033[1;34m▸ %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -x "$(command -v docker)" ] || die "Docker CLI tidak ditemukan."
docker info >/dev/null 2>&1 || die "Docker daemon tidak berjalan."

if curl -fsS "http://127.0.0.1:$PORT/readyz" >/dev/null 2>&1 || nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
  echo "ToGrow ID (dev) sudah berjalan di :$PORT"
  exit 0
fi

BIN="$TG_ROOT/target/debug/togrow-api"
[ -x "$BIN" ] || die "Binary belum ada: cargo build -p togrow-api di $TG_ROOT"

mkdir -p "$POS_ROOT/.local-run"
RAW="$POS_ROOT/.local-run/togrow-demo-env.raw"
ENVF="$POS_ROOT/.local-run/togrow-dev.env"
docker exec account-togrow-demo-api sh -c 'printenv' > "$RAW" 2>/dev/null \
  || die "Kontainer account-togrow-demo-api tidak dapat dibaca untuk mirroring env."

{
  grep -E '^[A-Z][A-Z0-9_]*=' "$RAW" | grep -vE '^(PATH|HOME|HOSTNAME|PWD|SHLVL|TERM)='
} > "$ENVF"

python3 - "$ENVF" "$PORT" <<'PY'
import sys, pathlib
path, port = pathlib.Path(sys.argv[1]), sys.argv[2]
lines = [l for l in path.read_text().splitlines()
         if not l.startswith(("BIND_ADDRESS=", "PUBLIC_BASE_URL=", "APP_ENV="))]
lines = [
    l.replace('@postgres:', '@127.0.0.1:')
     .replace('@redis:', '@127.0.0.1:')
     .replace('redis://redis:', 'redis://127.0.0.1:')
    for l in lines
    if not l.startswith(("SMTP_HOST=",))
]
lines += [
    f'APP_ENV=development',
    f'BIND_ADDRESS=127.0.0.1:{port}',
    f'PUBLIC_BASE_URL=http://127.0.0.1:{port}',
]
path.write_text("\n".join(lines) + "\n")
PY
chmod 600 "$ENVF"

log() { printf '\n\033[1;34m▸ %s\033[0m\n' "$*"; }
log "Menjalankan togrow-api native di http://127.0.0.1:$PORT"
set -a; # shellcheck disable=SC1090
source "$ENVF"; set +a
nohup "$BIN" >"$POS_ROOT/.local-run/togrow-dev.log" 2>&1 &

for i in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/.well-known/openid-configuration" || true)"
  [ "$code" = "200" ] && { log "DISCOVERY 200 ✔ — issuer dev: $(curl -s "http://127.0.0.1:$PORT/.well-known/openid-configuration" | python3 -c 'import sys,json;print(json.load(sys.stdin)["issuer"])')"; exit 0; }
  sleep 2
done
die "discovery belum hijau. Log: $POS_ROOT/.local-run/togrow-dev.log"
