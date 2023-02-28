#!/bin/sh

# flush the database
docker compose exec server-python-django python manage.py flush --noinput 
docker compose exec server-python-django python manage.py loaddata init.json
