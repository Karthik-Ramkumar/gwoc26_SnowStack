#!/usr/bin/env bash
# Basho Build Script for Render
# Exit on error
set -o errexit

echo "==> Starting Basho build process..."

# Upgrade pip
echo "==> Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install Python dependencies
echo "==> Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files (includes frontend build from git)
echo "==> Collecting static files..."
python manage.py collectstatic --no-input

# Run database migrations
echo "==> Running database migrations..."
python manage.py migrate

# Create superuser
echo "==> Creating superuser..."
python manage.py create_superuser --username karthik --email karthik@example.com --password admin123

echo "==> Build completed successfully! 🎉"
