#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Running Local CI Gate — hfe-pos (POS-ENG-STD-001)"
echo "=================================================="

echo ""
echo "[Step 1/8] Running Modularity Guard..."
python3 scripts/check-modularity.py

echo ""
echo "[Step 2/8] Validating Connector Manifest..."
python3 scripts/validate-connector.py

echo ""
echo "[Step 3/8] Running HFE-UI-STD-001 Standards Auditor..."
python3 scripts/audit-hfe-ui-standards.py

echo ""
echo "[Step 4/8] Running Typecheck (tsc)..."
npx tsc --noEmit

echo ""
echo "[Step 5/8] Running Rust Linter (Biome)..."
npm run lint

echo ""
echo "[Step 6/8] Running Unit Tests..."
npm run test --if-present

echo ""
echo "[Step 7/8] Running Production Build..."
npm run build

echo ""
echo "[Step 8/8] Running Bundle Size & Budget Guard (size-limit)..."
npx size-limit

echo ""
echo "=================================================="
echo " 🎉 All Local CI Verification Checks Passed Cleanly!"
echo "=================================================="
