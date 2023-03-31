#!/bin/sh

pvault bundle add --name ssn2 --bundle-code @./bundle.js
pvault datatype add --datatype-json @./types.js

pvault collection add --collection-pvschema "
customers PERSONS ( 
    ssn SSN2 UNIQUE NULL COMMENT 'Social security number',  
    owner_id INTEGER NULL,
    email EMAIL NULL,  
    name NAME NULL,
)"
