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

# Write DB/auth settings, plus any AI/search keys already present in the
# Cloud Agent process environment (Cursor secrets). Never write empty keys —
# an empty OPENAI_API_KEY= line can hide a real key that arrives later.
umask 077
{
  echo "DATABASE_URL=${DATABASE_URL}"
  echo "AUTH_SECRET=${AUTH_SECRET}"
  echo "NEXTAUTH_SECRET=${NEXTAUTH_SECRET}"
  echo "NEXTAUTH_URL=${NEXTAUTH_URL}"
  echo "LLM_PROVIDER=${LLM_PROVIDER}"
  if [[ -n "${OPENAI_API_KEY:-}" ]]; then
    echo "OPENAI_API_KEY=${OPENAI_API_KEY}"
  fi
  if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
    echo "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}"
  fi
  if [[ -n "${XAI_API_KEY:-}" ]]; then
    echo "XAI_API_KEY=${XAI_API_KEY}"
  fi
  if [[ -n "${EXA_API_KEY:-}" ]]; then
    echo "EXA_API_KEY=${EXA_API_KEY}"
  fi
  if [[ -n "${LLM_MODEL:-}" ]]; then
    echo "LLM_MODEL=${LLM_MODEL}"
  fi
} > /workspace/.env

if [[ -z "${EXA_API_KEY:-}" || ( -z "${OPENAI_API_KEY:-}" && -z "${ANTHROPIC_API_KEY:-}" && -z "${XAI_API_KEY:-}" ) ]]; then
  echo "WARNING: Research keys missing. Set OPENAI_API_KEY (or Anthropic/xAI) and EXA_API_KEY as Cursor secrets, then restart."
fi

npx prisma generate
if [[ -d prisma/migrations ]]; then
  npx prisma migrate deploy
else
  npx prisma db push
fi
npx prisma db seed || true

exec yarn dev --hostname 0.0.0.0 --port 3000
