#!/bin/sh
set -x

psql postgresql://postgres:postgres@db/postgres -c "SELECT * from api_customer; SELECT * from api_user;"

