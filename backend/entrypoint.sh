#!/bin/sh
set -e

echo "[STARTUP] Running database migrations..."
python manage.py migrate --noinput

echo "[STARTUP] Collecting static assets..."
python manage.py collectstatic --noinput

if [ "$SEED_DATABASE" = "true" ]; then
    echo "[STARTUP] Seeding initial portfolio content..."
    python manage.py seed_portfolio_data
fi

echo "[STARTUP] Launching Gunicorn WSGI server..."
exec "$@"
