#!/bin/sh

# restart piiano-vault with the new license
docker compose up piiano-vault -d
# regens the api key
docker compose exec piiano-vault sh -c "cd /usr/init && pvault iam regen-api-key --name Webapp --json | jq -r .api_key > /keys/webapp.key"
