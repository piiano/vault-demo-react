#!/bin/sh

docker compose exec server-python-django python wait_for_db.py
docker compose exec server-python-django python manage.py migrate
docker compose exec server-python-django python manage.py loaddata init.json
docker compose exec piiano-vault sh -c "cd /usr/init && ./init.sh"
docker compose exec kibana /usr/bin/create_index_pattern.sh
