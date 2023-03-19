<p>
  <a href="https://piiano.com/pii-data-privacy-vault/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://piiano.com/docs/img/logo-developers-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://piiano.com/wp-content/uploads/piiano-logo-developers.png">
      <img alt="Piiano Vault" src="https://piiano.com/wp-content/uploads/piiano-logo-developers.png" height="40" />
    </picture>
  </a>
</p>

_Piiano Vault: The secure home for sensitive personal data_  

*Safely store sensitive personal data in your own cloud environment with automated compliance controls.*

Piiano Vault demo using React
=============================

## Background

Piiano Vault is the secure home for sensitive personal data. It allows you to safely store sensitive personal data in your own cloud environment with automated compliance controls.  

Vault is deployed within your own architecture, next to other DBs used by the applications, and should be used to store the most critical sensitive personal data, such as credit cards and bank account numbers, names, emails, national IDs (e.g. SSN), phone numbers, etc.

The main benefits are:  

- Field level encryption, including key rotation.
- Searchability is allowed over the encrypted data.
- Full audit log for all data accesses.
- Granular access controls.
- Easy masking and tokenization of data.
- Out of the box privacy compliance functionality.

More details can be found [on our website](https://piiano.com/pii-data-privacy-vault/) and on the [developers portal](https://piiano.com/docs/).

## Prerequisites

- [Docker](https://www.docker.com/)
- [Piiano Vault](https://piiano.com/docs/guides/get-started)

## Running locally

To run this sample locally you need to start both a local dev server for the front-end (under `client` folder) and another server for the back-end (under `server` folder).

In addition, you will need a valid Piiano Vault service license to run Piiano Vault locally.

Follow the steps below to run locally.

1. Clone the project from GitHub:
```bash
git clone https://github.com/piiano/vault-demo-react.git
```

1. Copy the .env.example file into a file named .env in the folder of the server you want to use. For example:

```bash
cp .env.example .env
```

Update the .env file with your Piiano Vault service license and API key:

```
PVAULT_SERVICE_LICENSE=<your Piiano Vault license>
PVAULT_ADMIN_API_KEY="pvaultauth"
```

#### Running the API server

1. Go to `/server`
2. Pick the language you are most comfortable with and follow the README to run it.

#### Running the React client

1. Go to `/client`
2. Run `yarn`
3. Run `yarn start` and your default browser should now open with the front-end being served from http://localhost:3000/.

### Using the sample app

1. When running both servers, you are now ready to use the app running in http://localhost:3000.

2. Sign up
3. Navigate to `customers` and manage a list of customers that hold sensitive information like Social Security Numbers (SSN).
  

## Folder structure

The code in this directory contains a demo client in React and a set of server implmentation available in 2 common languages for a safe User management CRUD API with [Piiano Vault](http://piiano.com). 

The server includes [1 server implementations](server/README.md) [Python Django](/server/python-django). Each server implements several RESTful implementations, each with the same endpoints and logic.


# Docker compose
```bash
# This is so the dependecies exists on the local env, as we map it as volume into the container for simplifiying development
cd client && yarn
docker compose down --volumes && docker compose build && docker compose up -d
``` 

Browse http://localhost:3000
Note: The client and server files can be edited in run time
Browse [to kibana](http://localhost:5601/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15h,to:now))&_a=(columns:!(reason,operation_id,collection,user_name,personsIDs,data_requested,data_accessed,context.options,returned_count),filters:!(),interval:auto,query:(language:kuery,query:'type:audit'),sort:!(!('@timestamp',desc))))


1. Show the app
  - You can manage your customers
  - Support can see all, SSN is redacted

Issues

1. IDOR - can access other customer info
(John, edit a customer, http://localhost:3000/customers/3/edit)

2. SSN is maksed on the client side for the Support role
(Using the network tab in the debugging tools)

3. Show everythin is unencrypted in the DB
( terminal link, run `./1-db-connection.sh` )
  

4. Connect to `server` show how we can dump the DB 
( terminal link, run `./2-django-server-shell.sh` )

5. Sensitive data in logs
( edit + save customer, then use logs link )

6. One don't know who accessed data!



# Debugging
To connect to Vault
```bash
alias pvault="docker run --network=vault-demo_default --rm -i --add-host='host.docker.internal:host-gateway' -v $(pwd):/pwd -w /pwd piiano/pvault-cli:1.2.1"
pvault status
```

# Debug
```bash
docker compose exec -it client sh
wget http://server-python-django:8000/api/users

docker compose exec -it server-python-django sh
python manage.py shell
from api.models import *
```

# Dump DB from server
python -c 'import psycopg2,os,pprint;cu=psycopg2.connect(os.environ["DATABASE_URL"]).cursor();cu.execute("SELECT * from api_customer;");pprint.pprint(cu.fetchall())'
```python

import psycopg2,os
conn=psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor();
cur.execute("SELECT * from api_customer;")
print(cur.fetchall())
```