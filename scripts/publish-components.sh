#!/bin/bash
set -e

NEW_VERSION="$1"

# Build all components
pnpm -r run build

# Publish all packages with provenance
pnpm -r publish --provenance --access public --no-git-checks
