<p>
  <a href="https://piiano.com/pii-data-privacy-vault/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://piiano.com/docs/img/logo-developers-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://piiano.com/wp-content/uploads/piiano-logo-developers.png">
      <img alt="Piiano Vault" src="https://piiano.com/wp-content/uploads/piiano-logo-developers.png" height="40" />
    </picture>
  </a>
</p>

# Piiano Vault

**The secure home for sensitive personal data**

Safely store sensitive personal data in your own cloud environment with automated compliance controls. [More details](#about-piiano-vault)

Piiano Vault demo using React
=============================

This repository contains a demo application to showcase the power of [Piiano Vault](https://piiano.com/) allowing to easily and transparently protect and encrypt data in a web application DB.

## Prerequisites

- [Docker](https://www.docker.com/)
- [Piiano Vault](https://piiano.com/docs/guides/get-started)
- [Piiano Vault CLI](https://piiano.com/docs/cli/installation)

## Folder structure

The code in this directory contains a demo client in React and a set of server implmentation available in common languages for a safe User management CRUD API with [Piiano Vault](http://piiano.com). 

The server includes [1 server implementation](server/README.md) - [Python Django](/server/python-django). Each server implements several RESTful implementations, each with the same endpoints and logic.

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

1. Update the .env file with your Piiano Vault service license and API key:

  ```
  PVAULT_SERVICE_LICENSE=<your Piiano Vault license>
  PVAULT_ADMIN_API_KEY="pvaultauth"
  ```

### With Docker Compose

The Docker Compose file includes all the required components to run this demo application, including Elastic stack for viewing logs and a web based Terminal to 
mimic an attacker with access to the DB server and showcase the power of Piiano Vault to lower to minimum the attack surface.

1. Run Docker Compose

  ```bash
  # This is so the dependecies exists on the local env, as we map it as volume into the container for simplifiying development
  docker compose down --volumes && docker compose build && docker compose up -d
  ``` 

2. Navigate to the client web application at http://localhost:3000
  
  
**Note:** The client and server files can be edited in run time.

## Debugging

In addition to having Elastic stack for logging, you can directly attach to the running containers to view logs, and run some debugging scripts:

### Piiano Vault

Create an alias for Piiano Vault CLI and attach its network to the Piiano Vault container:

```bash
pvault status
pvault confvar set --name log_level --value debug
# Fetch Piiano Vault container logs
docker compose logs -f piiano-vault
```

### Client

Execute shell within the client container:  

```bash
docker compose exec -it client sh
wget http://server-python-django:8000/api/users
```

### Server

Execute shell within the server container:  

```bash
docker compose exec -it server-python-django sh
python manage.py shell
from api.models import *
```

### Dump DB from server

```bash
python -c 'import psycopg2,os,pprint;cu=psycopg2.connect(os.environ["DATABASE_URL"]).cursor();cu.execute("SELECT * from api_customer;");pprint.pprint(cu.fetchall())'
```

```python
import psycopg2,os
conn=psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor();
cur.execute("SELECT * from api_customer;")
print(cur.fetchall())
```

# About Piiano Vault

Piiano Vault is the secure home for sensitive personal data. It allows you to safely store sensitive personal data in your own cloud environment with automated compliance controls.  

Vault is deployed within your own architecture, next to other DBs used by the applications, and should be used to store or encrypt the most critical sensitive personal data, such as credit cards and bank account numbers, names, emails, national IDs (e.g. SSN), phone numbers, etc.

The main benefits are:  

- Granular access controls.
- Field level encryption.
- Transparent key management and rotation.
- Searchability is allowed over the encrypted data.
- Full audit log for all data accesses.
- Easy masking and tokenization of data.
- Out of the box privacy compliance functionality - DSAR, RTBF.
- Data minimization and retention.

More details can be found [on our website](https://piiano.com/pii-data-privacy-vault/) and on the [developers portal](https://piiano.com/docs/).
