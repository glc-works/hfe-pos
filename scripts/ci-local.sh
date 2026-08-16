#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Running Local CI Gate — hfe-pos (POS-ENG-STD-001)"
echo "=================================================="

echo ""
echo "[Step 1/7] Running Modularity Guard..."
python3 scripts/check-modularity.py

echo ""
echo "[Step 2/7] Validating Connector Manifest..."
python3 scripts/validate-connector.py

echo ""
echo "[Step 3/7] Running HFE-UI-STD-001 Standards Auditor..."
python3 scripts/audit-hfe-ui-standards.py

echo ""
echo "[Step 4/7] Running Typecheck (tsc)..."
npx tsc --noEmit

echo ""
echo "[Step 5/7] Running Linter (eslint)..."
npm run lint

echo ""
echo "[Step 6/7] Running Unit Tests..."
npm run test --if-present

echo ""
echo "[Step 7/7] Running Production Build..."
npm run build

echo ""
echo "=================================================="
echo " 🎉 All Local CI Verification Checks Passed Cleanly!"
echo "=================================================="
