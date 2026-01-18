release: python manage.py migrate && python manage.py create_superuser --username karthik --email karthik@example.com --password admin123
web: gunicorn basho_project.wsgi:application --bind 0.0.0.0:$PORT --workers 4 --worker-class sync --timeout 60
