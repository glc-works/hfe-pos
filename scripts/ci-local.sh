#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Running Local CI Gate — hfe-pos (POS-ENG-STD-001)"
echo "=================================================="

echo ""
echo "[Step 1/6] Running Modularity Guard..."
python3 scripts/check-modularity.py

echo ""
echo "[Step 2/6] Validating Connector Manifest..."
python3 scripts/validate-connector.py

echo ""
echo "[Step 3/6] Running Typecheck (tsc)..."
npx tsc --noEmit

echo ""
echo "[Step 4/6] Running Linter (eslint)..."
npm run lint

echo ""
echo "[Step 5/6] Running Unit Tests..."
npm run test --if-present

echo ""
echo "[Step 6/6] Running Production Build..."
npm run build

echo ""
echo "=================================================="
echo " 🎉 All Local CI Verification Checks Passed Cleanly!"
echo "=================================================="
