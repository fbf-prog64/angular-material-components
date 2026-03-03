#!/bin/bash
set -e

NEW_VERSION="$1"

# Update all workspace packages
pnpm -r exec -- npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version

# (Optional) Update root package.json as well, if needed
npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version
