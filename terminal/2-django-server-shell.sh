#!/bin/sh
set -x

docker compose exec server-python-django python -c 'import psycopg2,os,pprint;cu=psycopg2.connect(os.environ["DATABASE_URL"]).cursor();cu.execute("SELECT * from api_customer;");pprint.pprint(cu.fetchall())'
