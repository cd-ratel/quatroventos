#!/bin/bash
set -euo pipefail

APP_CONTAINER="quatroventos-app"
DB_SERVICE="db"
APP_SERVICE="app"
MAX_HEALTH_RETRIES=30

echo "Quatro Ventos deploy"
echo "===================="

if [ ! -f "docker-compose.yml" ]; then
  echo "docker-compose.yml not found. Run this from the project root."
  exit 1
fi

if [ ! -f ".env" ]; then
  echo ".env file not found. Copy .env.example to .env and fill in values."
  exit 1
fi

wait_for_status() {
  local container_name="$1"
  local expected_status="$2"
  local retries="${3:-30}"

  for _ in $(seq 1 "$retries"); do
    local status
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_name" 2>/dev/null || true)"
    if [ "$status" = "$expected_status" ]; then
      return 0
    fi
    sleep 2
  done

  return 1
}

echo "Building app and bootstrap images..."
docker compose --profile setup build app migrate

echo "Starting database..."
docker compose up -d "$DB_SERVICE"

echo "Waiting for database healthcheck..."
if ! wait_for_status "quatroventos-db" "healthy" 20; then
  echo "Database did not become healthy."
  docker compose logs --tail 80 "$DB_SERVICE"
  exit 1
fi

echo "Running database bootstrap..."
docker compose --profile setup run --rm migrate

echo "Starting application..."
docker compose up -d "$APP_SERVICE"

echo "Waiting for application healthcheck..."
if ! wait_for_status "$APP_CONTAINER" "healthy" "$MAX_HEALTH_RETRIES"; then
  echo "Application did not become healthy."
  docker compose logs --tail 120 "$APP_SERVICE"
  exit 1
fi

echo
echo "Deploy complete."
echo
echo "Services:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo
echo "Site: https://quatroventos.redecm.com.br"
echo "Admin: https://adminquatroventos.redecm.com.br/admin"
