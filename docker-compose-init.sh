#!/bin/sh

docker compose exec server-python-django python wait_for_db.py
docker compose exec server-python-django python manage.py migrate
docker compose exec server-python-django python manage.py loaddata init.json
docker compose exec piiano-vault pvault collection add --collection-pvschema "customers PERSONS ( ssn SSN UNIQUE NULL COMMENT 'Social security number',  email EMAIL NULL,  name NAME NULL,)"
docker compose exec kibana /usr/bin/create_index_pattern.sh
