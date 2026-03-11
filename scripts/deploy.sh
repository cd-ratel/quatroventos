#!/bin/bash
set -euo pipefail

echo "🚀 Quatro Ventos — Deploy Script"
echo "================================"

# Verify we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ docker-compose.yml not found. Run this from the project root."
  exit 1
fi

# Verify .env exists
if [ ! -f ".env" ]; then
  echo "❌ .env file not found. Copy .env.example to .env and fill in values."
  exit 1
fi

echo "📦 Building containers..."
docker compose build --no-cache

echo "🗃️ Running database migrations..."
docker compose --profile setup run --rm migrate

echo "🔄 Restarting services..."
docker compose up -d

echo ""
echo "✅ Deploy complete!"
echo ""
echo "Services:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 Site: https://quatroventos.redecm.com.br"
echo "🔧 Admin: https://quatroventos.redecm.com.br/admin"
