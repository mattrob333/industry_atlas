#!/usr/bin/env bash
# Start Postgres and the Next.js app. Runs on every Cloud Agent boot.
# API keys (OPENAI_API_KEY, EXA_API_KEY, …) come from Cursor secrets in the
# process environment. This script does not write those keys to disk.
set -euo pipefail
cd /workspace

if ! pg_isready -q 2>/dev/null; then
  sudo pg_ctlcluster 16 main start 2>/dev/null || sudo service postgresql start || true
fi
for _ in $(seq 1 30); do
  pg_isready -q && break
  sleep 1
done
pg_isready -q

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='industry_atlas'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER industry_atlas WITH PASSWORD 'industry_atlas_dev' SUPERUSER;"
fi
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='industry_atlas'" | grep -q 1; then
  sudo -u postgres createdb -O industry_atlas industry_atlas
fi

export DATABASE_URL="${DATABASE_URL:-postgresql://industry_atlas:industry_atlas_dev@127.0.0.1:5432/industry_atlas}"
export AUTH_SECRET="${AUTH_SECRET:-$(openssl rand -base64 32)}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-$AUTH_SECRET}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://localhost:3000}"
export LLM_PROVIDER="${LLM_PROVIDER:-openai}"

# Keep a local .env for Next.js database/auth only. Do not dump API keys here.
umask 077
cat > /workspace/.env <<EOF
DATABASE_URL=${DATABASE_URL}
AUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${NEXTAUTH_URL}
LLM_PROVIDER=${LLM_PROVIDER}
EOF

npx prisma generate
if [[ -d prisma/migrations ]]; then
  npx prisma migrate deploy
else
  npx prisma db push
fi
npx prisma db seed || true

exec yarn dev --hostname 0.0.0.0 --port 3000
