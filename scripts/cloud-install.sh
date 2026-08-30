#!/usr/bin/env bash
# Install app dependencies. Safe to run more than once.
set -euo pipefail
cd /workspace

if [[ -f yarn.lock ]]; then
  yarn install --frozen-lockfile
else
  yarn install
fi

npx prisma generate
