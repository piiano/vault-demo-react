#!/bin/bash

KIBANA_URL="http://kibana:5601"
INDEX_PATTERN="vault-demo-*"
TIME_FIELD="@timestamp"

# Wait for Kibana to start
until $(curl --output /dev/null --silent --head --fail "$KIBANA_URL"); do
    printf '.'
    sleep 5
done

# Create the index pattern
curl -X POST -H "Content-Type: application/json" -H "kbn-xsrf: true" \
     -d "{\"attributes\":{\"title\":\"${INDEX_PATTERN}\",\"timeFieldName\":\"${TIME_FIELD}\"}}" \
     "${KIBANA_URL}/api/saved_objects/index-pattern"
