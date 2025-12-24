#!/bin/bash

# Basho Products Django - Setup Script
# This script sets up the Django project for first use

echo "=========================================="
echo "  Basho Products - Django Setup"
echo "=========================================="
echo ""

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate

# Run migrations
echo "✓ Creating database tables..."
python manage.py makemigrations
python manage.py migrate

# Check if superuser exists
echo ""
echo "=========================================="
echo "  Create Admin User"
echo "=========================================="
echo "You'll need this to access the admin panel at http://localhost:8000/admin/"
echo ""
python manage.py createsuperuser

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run the server: python manage.py runserver"
echo "2. Open browser: http://localhost:8000/"
echo "3. Access admin: http://localhost:8000/admin/"
echo "4. Add products via admin panel"
echo ""
echo "See README.md for detailed instructions"
echo ""
