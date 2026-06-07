#!/usr/bin/env bash
# Compares old and new CTag files to detect calendar changes
# Usage: compare-ctag.sh <old-ctag-file> <new-ctag-file> [force]
# Outputs: changed=true or changed=false to $GITHUB_OUTPUT

set -euo pipefail

OLD_CTAG_FILE="${1:-old.ctag}"
NEW_CTAG_FILE="${2:-new.ctag}"
FORCE="${3:-false}"

if [ ! -f "$OLD_CTAG_FILE" ]; then
  echo "No previous CTag found, will trigger build"
  echo "changed=true" >> "$GITHUB_OUTPUT"
elif cmp -s "$OLD_CTAG_FILE" "$NEW_CTAG_FILE"; then
  echo "CTag unchanged, skipping build"
  echo "changed=false" >> "$GITHUB_OUTPUT"
else
  echo "CTag changed!"
  echo "Old: $(cat "$OLD_CTAG_FILE")"
  echo "New: $(cat "$NEW_CTAG_FILE")"
  echo "changed=true" >> "$GITHUB_OUTPUT"
fi

# Force rebuild if requested
if [ "$FORCE" == "true" ]; then
  echo "Force rebuild requested"
  echo "changed=true" >> "$GITHUB_OUTPUT"
fi
