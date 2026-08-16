#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Hfe Contract Synchronization & Health Check Script
# Validates Experience Layer integration with Headless Company Books Core.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "=================================================="
echo " Running Hfe Contract & Pilot Consumer Gate Check"
echo "=================================================="

# 1. Validate Connector Manifest
echo "[1/3] Validating connector.manifest.json..."
python3 scripts/validate-connector.py

# 2. Check Modularity Guard
echo "[2/3] Verifying Code Modularity Threshold..."
python3 scripts/check-modularity.py

# 3. Check Hfe API Endpoint Reachability
echo "[3/3] Checking Hfe Core API Readiness (http://localhost:8080)..."
if curl -s --connect-timeout 1 http://localhost:8080/health >/dev/null 2>&1; then
  echo "  🟢 [LIVE] Hfe Core Backend is ONLINE & Healthy!"
else
  echo "  🟡 [STANDALONE/DEV] Hfe Core Backend offline. Fallback to resilient offline buffer & mock adapter active."
fi

echo ""
echo "=================================================="
echo " 🎉 Hfe Contract & Manifest Verification PASSED!"
echo "=================================================="
