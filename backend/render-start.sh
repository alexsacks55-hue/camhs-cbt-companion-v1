#!/bin/sh
# Resolve any previously-failed migrations before deploying.
# The || true means this is safe to run even if there's nothing to resolve.
npx prisma migrate resolve --rolled-back 0005_add_wind_down_logs || true
npx prisma migrate deploy
node dist/index.js
