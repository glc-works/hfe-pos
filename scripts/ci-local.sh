#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Running Local CI Gate — hfe-pos (POS-ENG-STD-001)"
echo "=================================================="

echo ""
echo "[Step 1/9] Running Repository Hygiene Guard..."
python3 scripts/check-repo-hygiene.py

echo ""
echo "[Step 2/9] Running Modularity Guard..."
python3 scripts/check-modularity.py

echo ""
echo "[Step 3/9] Validating Connector Manifest..."
python3 scripts/validate-connector.py

echo ""
echo "[Step 4/9] Running HFE-UI-STD-001 Standards Auditor..."
python3 scripts/audit-hfe-ui-standards.py

echo ""
echo "[Step 5/9] Running Typecheck (tsc)..."
npx tsc --noEmit

echo ""
echo "[Step 6/9] Running Linter (Biome) & Repo-Wide Secret Scanner (Secretlint)..."
npm run lint
npm run lint:secrets

echo ""
echo "[Step 7/9] Running Unit Tests..."
npm run test --if-present

echo ""
echo "[Step 8/9] Running Production Build..."
npm run build

echo ""
echo "[Step 9/9] Running Bundle Size & Budget Guard (size-limit)..."
npx size-limit

echo ""
echo "=================================================="
echo " 🎉 All Local CI Verification Checks Passed Cleanly!"
echo "=================================================="
