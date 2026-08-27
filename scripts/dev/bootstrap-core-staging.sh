#!/usr/bin/env bash
# --- Bootstrap HCB2 CORE staging for real-money verification (#35 final pass) ---
# Automates every locally-automatable step of ../headless-company-books/deploy/staging:
#   1. TigerBeetle replica on the HOST at 0.0.0.0:3010 (cluster 0), file-backed.
#   2. .env.staging generation (PG password + cursor signing keys) if absent.
#   3. hcb2-service:staging image build via the sibling build.sh (uses gh auth token).
#   4. docker compose up -d + wait for http://127.0.0.1:8080/readyz == 200.
#
# The ONLY human-gated remainder is the WorkOS identity flow (external SaaS,
# Rule 33): workos-login.py in a browser, principal seeding SQL, first Company
# Book creation — printed verbatim as NEXT FOUNDER STEPS at the end.
set -euo pipefail

POS_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HCB_ROOT="${HFE_HCB_ROOT:-$POS_ROOT/../headless-company-books}"
STAGING_DIR="$HCB_ROOT/deploy/staging"
LOCAL_RUN="$POS_ROOT/.local-run/tigerbeetle"
TB_VERSION="0.16.47"
TB_PORT="3010"

log() { printf '\n\033[1;34m▸ %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -x "$(command -v docker)" ] || die "Docker CLI tidak ditemukan — install Docker Desktop/Rancher dulu."
[ -d "$HCB_ROOT/hcb2/service/src" ] || die "Sibling CORE repo tidak ada di $HCB_ROOT"
docker info >/dev/null 2>&1 || die "Docker daemon tidak berjalan."

# ── 1. TigerBeetle on host ────────────────────────────────────────────────────
mkdir -p "$LOCAL_RUN"
TB_BIN="$LOCAL_RUN/tigerbeetle"
if [ ! -x "$TB_BIN" ]; then
  log "Mengunduh TigerBeetle v$TB_VERSION (macos-aarch64/x86_64 auto)…"
  ARCH="$(uname -m)"
  case "$ARCH" in
    arm64)  TB_ASSET="x86_64" ;; # official releases ship universal x86_64 binaries that run under Rosetta OR native aarch64 builds per version; prefer aarch64 when published
    *)      TB_ASSET="x86_64" ;;
  esac
  # Try native aarch64 asset first on Apple Silicon, fall back to x86_64.
  TRY_LIST="tigerbeetle-$TB_ASSET"
  [ "$ARCH" = "arm64" ] && TRY_LIST="tigerbeetle-aarch64 tigerbeetle-x86_64"
  DOWNLOADED=""
  for ASSET in $TRY_LIST; do
    URL="https://github.com/tigerbeetle/tigerbeetle/releases/download/$TB_VERSION/$ASSET.zip"
    if curl -fsSL -o "$LOCAL_RUN/tb.zip" "$URL"; then DOWNLOADED="$URL"; break; fi
  done
  [ -n "$DOWNLOADED" ] || die "Gagal mengunduh TigerBeetle $TB_VERSION. Cek jaringan/versi."
  unzip -oq "$LOCAL_RUN/tb.zip" -d "$LOCAL_RUN/unzipped"
  find "$LOCAL_RUN/unzipped" -name tigerbeetle -type f -exec cp {} "$TB_BIN" \;
  chmod +x "$TB_BIN"
  echo "  dari: $DOWNLOADED"
fi

if ! nc -z 127.0.0.1 "$TB_PORT" 2>/dev/null; then
  [ -f "$LOCAL_RUN/cluster_0.tigerbeetle" ] || "$TB_BIN" format --cluster=0 --replica=0 --replica-count=1 "$LOCAL_RUN/cluster_0.tigerbeetle"
  log "Menjalankan TigerBeetle cluster 0 di 0.0.0.0:$TB_PORT (nohup)…"
  nohup "$TB_BIN" start --addresses=0.0.0.0:$TB_PORT "$LOCAL_RUN/cluster_0.tigerbeetle" \
    >"$LOCAL_RUN/server.log" 2>&1 &
  sleep 2
else
  echo "TigerBeetle sudah berjalan di :$TB_PORT"
fi
nc -z 127.0.0.1 "$TB_PORT" || die "TigerBeetle gagal listen pada :$TB_PORT (lihat $LOCAL_RUN/server.log)"

# ── 2. .env.staging ───────────────────────────────────────────────────────────
cd "$STAGING_DIR"
if [ ! -f .env.staging ]; then
  log "Generate deploy/staging/.env.staging lokal (placeholder SMTP, kunci acak)…"
  PG_PASS="$(openssl rand -base64 24 | tr '/+' 'Aa')"
  CUR_KEY_ID="staging-key-1"
  CUR_KEY_VAL="$(openssl rand -base64 32)"
  cat > .env.staging <<ENV
STAGING_PG_PASSWORD=$PG_PASS
STAGING_OIDC_ISSUER=https://auth.workos.com/
STAGING_OIDC_AUDIENCE=api://default
STAGING_OIDC_SCOPE=openid profile email offline_access
STAGING_OIDC_CLIENTS=client_01KZWCNZPRYP7DQCDNYRB7FHNX
STAGING_OIDC_HUMAN_CLAIM=amr
STAGING_OIDC_HUMAN_VALUES=pwd,mfa
STAGING_CURSOR_KEY_ID=$CUR_KEY_ID
STAGING_CURSOR_KEYS=$CUR_KEY_ID:$CUR_KEY_VAL
STAGING_SMTP_RELAY=smtp.mailtrap.test
STAGING_SMTP_FROM=pos-staging@hfeit.test
STAGING_SMTP_USERNAME=placeholder
STAGING_SMTP_PASSWORD=placeholder
STAGING_PUBLIC_BASE_URL=http://localhost:8888
ENV
  chmod 600 .env.staging
else
  echo ".env.staging sudah ada — dipertahankan."
fi

# ── 3. Build image (skip bila sudah ada) ──────────────────────────────────────
if docker image inspect hcb2-service:staging >/dev/null 2>&1; then
  echo "Image hcb2-service:staging sudah ada — build dilewati."
else
  log "Build hcb2-service:staging (token otomatis dari gh auth)…"
  bash "$HCB_ROOT/scripts/staging/build.sh"
fi

# ── 4. Compose up + readiness ─────────────────────────────────────────────────
log "docker compose up -d (postgres + service)…"
set -a; source .env.staging; set +a
docker compose -p hcb-staging up -d

for i in $(seq 1 36); do
  code="$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/readyz || true)"
  [ "$code" = "200" ] && break
  [ $((i % 6)) -eq 0 ] && echo "  menunggu /readyz… ($i)"
  sleep 5
done
curl -fsS http://127.0.0.1:8080/readyz >/dev/null || die "/readyz belum hijau dalam 180 detik. Cek: docker compose -p hcb-staging logs service"

log "STACK HIDUP ✔ — POSTGRES (:5432), TIGERBEETLE (:3010), CORE (/readyz 200)"

cat <<'NEXT'

════════════════════════════════════════════════════════════════
 LANGKAH FOUNDER (gerbang WorkOS — butuh browser kamu)
════════════════════════════════════════════════════════════════
1) Isi WORKOS_API_KEY di shell lalu jalankan helper login:
     cd '"'"$(pwd)"'"'
     export WORKOS_API_KEY="sk_test_..."      # dari dashboard WorkOS
     python3 ../../scripts/staging/workos-login.py
   (buat test user Email+Password di dashboard bila belum ada)

2) Seed Principal dengan output User ID dari langkah 1:
     docker compose exec postgres psql -U company_books -d company_books -c \
       "INSERT INTO principals (id, issuer, subject) VALUES (gen_random_uuid(), 'https://auth.workos.com/', 'user_01JZ...');"

3) Kabari agent sesi ini dengan JWT yang tercetak — sambungannya ke POS akan
   diselesaikan dan transaksi uang-nyata pertama dieksekusi bersama.
════════════════════════════════════════════════════════════════
NEXT
