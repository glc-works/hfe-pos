#!/usr/bin/env bash
set -euo pipefail

echo "=================================================="
echo " Running Local CI Gate — hfe-pos (POS-ENG-STD-001)"
echo "=================================================="

echo ""
echo "[Step 1/10] Running Repository Hygiene Guard..."
python3 scripts/check-repo-hygiene.py

echo ""
echo "[Step 2/10] Running Modularity Guard..."
python3 scripts/check-modularity.py

echo ""
echo "[Step 3/10] Validating Connector Manifest..."
python3 scripts/validate-connector.py

echo ""
echo "[Step 4/10] Running HFE-UI-STD-001 Standards & Theme Contrast Auditor..."
python3 scripts/audit-hfe-ui-standards.py
python3 scripts/audit-theme-contrast.py

echo ""
echo "[Step 5/10] Running Typecheck (tsc)..."
npx tsc --noEmit

echo ""
echo "[Step 6/10] Running Linter (Biome) & Repo-Wide Secret Scanner (Secretlint)..."
npm run lint
npm run lint:secrets

echo ""
echo "[Step 7/10] Running Unit Tests..."
npm run test --if-present

echo ""
echo "[Step 8/10] Running Production Build..."
npm run build

echo ""
echo "[Step 9/10] Running Bundle Size & Budget Guard (size-limit)..."
npx size-limit

echo ""
echo "[Step 10/10] Running Data Truth Boundary Gate (zero fake-green surfaces)..."
npm run check:truth-boundary

echo ""
echo "=================================================="
echo " 🎉 All Local CI Verification Checks Passed Cleanly!"
echo "=================================================="
