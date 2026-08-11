#!/bin/bash
set -e

echo "🌱 Project Emerald — starting…"

export PORT=1000
mkdir -p /app/data /app/.uploads

# ------------------------------------------------------------------
# Secrets: env-provided values win, else reuse persisted ones,
# else generate and persist them on the data volume.
# ------------------------------------------------------------------
rand_b64() { node -e "console.log(require('crypto').randomBytes($1).toString('base64'))"; }

SECRETS_FILE="/app/data/.secrets"
PROVIDED_DM="$DOCUMENT_MASTER_KEY"
PROVIDED_JWT="$JWT_SECRET"
PROVIDED_PP="$PIN_PEPPER"

if [ -f "$SECRETS_FILE" ]; then
  # shellcheck disable=SC1090
  . "$SECRETS_FILE"
fi

DOCUMENT_MASTER_KEY="${PROVIDED_DM:-$DOCUMENT_MASTER_KEY}"
JWT_SECRET="${PROVIDED_JWT:-$JWT_SECRET}"
PIN_PEPPER="${PROVIDED_PP:-$PIN_PEPPER}"

: "${DOCUMENT_MASTER_KEY:=$(rand_b64 32)}"
: "${JWT_SECRET:=$(rand_b64 48)}"
: "${PIN_PEPPER:=$(rand_b64 24)}"
export DOCUMENT_MASTER_KEY JWT_SECRET PIN_PEPPER

if [ ! -f "$SECRETS_FILE" ]; then
  {
    echo "export DOCUMENT_MASTER_KEY=$DOCUMENT_MASTER_KEY"
    echo "export JWT_SECRET=$JWT_SECRET"
    echo "export PIN_PEPPER=$PIN_PEPPER"
  } > "$SECRETS_FILE"
  echo "🔐 Generated secrets and persisted to $SECRETS_FILE"
fi

if [ "$JWT_SECRET" = "dev-secret-change-me-in-production" ]; then
  echo "⚠️  Using insecure development JWT secret."
fi
if [ -z "$ADMIN_PHONES" ]; then
  echo "⚠️  ADMIN_PHONES not set — /api/admin endpoints reject all requests in production."
fi

# ------------------------------------------------------------------
# Database ships pre-built in the image (schema + seed + ingestion).
# ------------------------------------------------------------------
if [ ! -f /app/data/emerald.db ]; then
  echo "❌ FATAL: /app/data/emerald.db missing."
  echo "   Run: docker compose down -v && docker compose up --build"
  exit 1
fi

SCHEME_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.scheme.count().then(c => { console.log(c); return p.\$disconnect(); }).catch(() => console.log('0'));
" 2>/dev/null || echo "?")
echo "🗄️  Database ready — $SCHEME_COUNT scheme(s)"

echo ""
echo "====================================================="
echo "🚀 Project Emerald running on http://localhost:$PORT"
echo "   OTP codes are printed to this console ([DEV OTP])"
echo "====================================================="
echo ""

exec node server.js