#!/usr/bin/env python3
"""
validate-connector.py — Connector Manifest Validator for Hfe POS

Validates connector.manifest.json formatting, required fields, and
enforces whitelist permissions per POS-ENG-STD-001 (Rule 3).
"""

import argparse
import json
import os
import sys

REQUIRED_KEYS = {"name", "slug", "version", "permissions", "monetization", "endpoints"}

ALLOWED_PERMISSIONS = {
    "accounting.post",
    "payments.process",
    "inventory.read",
    "contacts.manage",
    "subledger.post_transaction",
    "biller.create_split",
    "tax.calculate_ppn",
    "inventory.sync_stock",
}


def validate_connector_manifest(manifest_path: str) -> int:
    if not os.path.exists(manifest_path):
        print(f"[MANIFEST ERROR] File '{manifest_path}' not found.", file=sys.stderr)
        return 1

    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"[MANIFEST FAIL] Invalid JSON syntax in '{manifest_path}': {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"[MANIFEST ERROR] Failed to read '{manifest_path}': {e}", file=sys.stderr)
        return 1

    if not isinstance(data, dict):
        print(f"[MANIFEST FAIL] Manifest root must be a JSON object.", file=sys.stderr)
        return 1

    # Check required top-level keys
    missing_keys = REQUIRED_KEYS - set(data.keys())
    if missing_keys:
        print(f"[MANIFEST FAIL] Missing required key(s): {', '.join(sorted(missing_keys))}", file=sys.stderr)
        return 1

    # Validate permissions type and whitelist
    permissions = data.get("permissions")
    if not isinstance(permissions, list):
        print(f"[MANIFEST FAIL] 'permissions' must be an array/list.", file=sys.stderr)
        return 1

    invalid_permissions = [p for p in permissions if p not in ALLOWED_PERMISSIONS]
    if invalid_permissions:
        print(
            f"[MANIFEST FAIL] Unauthorized permission(s) found: {', '.join(invalid_permissions)}\n"
            f"Allowed permissions: {', '.join(sorted(ALLOWED_PERMISSIONS))}",
            file=sys.stderr,
        )
        return 1

    # Validate monetization and endpoints types
    if not isinstance(data.get("monetization"), dict):
        print(f"[MANIFEST FAIL] 'monetization' must be an object.", file=sys.stderr)
        return 1

    if not isinstance(data.get("endpoints"), dict):
        print(f"[MANIFEST FAIL] 'endpoints' must be an object.", file=sys.stderr)
        return 1

    print(f"[MANIFEST PASSED] '{manifest_path}' is valid and fully compliant with POS-ENG-STD-001.")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Validate Hfe POS connector manifest.")
    parser.add_argument(
        "--manifest",
        default="connector.manifest.json",
        help="Path to manifest file (default: connector.manifest.json)",
    )
    args = parser.parse_args()

    sys.exit(validate_connector_manifest(args.manifest))


if __name__ == "__main__":
    main()
