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

trim_carriage_return() {
  printf '%s' "$1" | tr -d '\r'
}

read_env_value() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" .env | tail -n 1 || true)"
  trim_carriage_return "${line#*=}"
}

require_env_value() {
  local key="$1"
  local value
  value="$(read_env_value "$key")"

  if [ -z "$value" ]; then
    echo "Missing required environment variable: ${key}"
    exit 1
  fi

  local upper_value
  upper_value="$(printf '%s' "$value" | tr '[:lower:]' '[:upper:]')"
  if [[ "$upper_value" == *"CHANGE_ME"* ]] || [[ "$upper_value" == *"GENERATE_WITH_OPENSSL"* ]] || [[ "$upper_value" == *"PLACEHOLDER"* ]]; then
    echo "Environment variable ${key} still contains a placeholder value."
    exit 1
  fi
}

assert_strong_password() {
  local label="$1"
  local value="$2"

  if [ "${#value}" -lt 12 ]; then
    echo "${label} must contain at least 12 characters."
    exit 1
  fi

  if ! [[ "$value" =~ [a-z] && "$value" =~ [A-Z] && "$value" =~ [0-9] && "$value" =~ [^A-Za-z0-9] ]]; then
    echo "${label} must include uppercase, lowercase, numeric, and symbol characters."
    exit 1
  fi
}

echo "Validating environment..."
for required_var in DATABASE_URL POSTGRES_PASSWORD NEXTAUTH_SECRET NEXTAUTH_URL ADMIN_EMAIL ADMIN_PASSWORD APP_URL ADMIN_URL SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS SMTP_FROM; do
  require_env_value "$required_var"
done

app_url="$(read_env_value APP_URL)"
admin_url="$(read_env_value ADMIN_URL)"
nextauth_url="$(read_env_value NEXTAUTH_URL)"
admin_password="$(read_env_value ADMIN_PASSWORD)"

if [ "$app_url" = "$admin_url" ]; then
  echo "APP_URL and ADMIN_URL must be different."
  exit 1
fi

if [ "$nextauth_url" != "$admin_url" ]; then
  echo "NEXTAUTH_URL must match ADMIN_URL."
  exit 1
fi

assert_strong_password "ADMIN_PASSWORD" "$admin_password"

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
