#!/bin/bash

# Basho Products - React + Django Startup Script
# Starts both Django backend and React frontend

echo "=========================================="
echo "  Basho Products - React + Django"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "Error: Please run this script from the basho_products_django directory"
    exit 1
fi

# Start Django backend in background
echo "✓ Starting Django backend on port 8000..."
source venv/bin/activate
python manage.py runserver > /dev/null 2>&1 &
DJANGO_PID=$!
echo "  Django PID: $DJANGO_PID"

# Wait for Django to start
sleep 2

# Start React frontend
echo "✓ Starting React frontend on port 3000..."
echo ""
cd frontend
npm start

# Cleanup function
cleanup() {
    echo ""
    echo "=========================================="
    echo "  Shutting down servers..."
    echo "=========================================="
    kill $DJANGO_PID 2>/dev/null
    echo "✓ Stopped Django server"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Wait
wait
