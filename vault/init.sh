#!/bin/sh

pvault confvar set --name log_level --value debug
pvault bundle add --name bundle --bundle-code @./bundle.js
pvault datatype add --datatype-json @./type_email.js
pvault datatype add --datatype-json @./type_name.js
pvault datatype add --datatype-json @./type_ssn.js
pvault iam apply --conf @iam.toml 
pvault iam regen-api-key --name Webapp --json | jq -r .api_key > /keys/webapp.key

pvault collection add --collection-pvschema "
customers PERSONS ( 
    ssn SSN_PROT UNIQUE NULL COMMENT 'Social security number',  
    owner_id INTEGER NULL,
    email EMAIL_PROT NULL,  
    name NAME_PROT NULL,
)"
