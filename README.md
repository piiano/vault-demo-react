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

# Piiano Vault demo using React

This repository contains a demo application to showcase the power of [Piiano Vault](https://piiano.com/) allowing to easily and transparently protect and encrypt data in a web application DB.

The demo application is a simple Customer management SaaS application, allowing users to create, edit, delete and list their customers.

The application includes 2 roles - `Member` and `Support`. The `Support` role can see all the customers in the system but SSN is masked by default unless an OTP (one-time password) code is provided when clicking the "Reveal" button. The `Member` role can only see the customers they created.

The application is implemented in React and uses a RESTful API to communicate with the backend.

The backend is implemented in Python Django and uses a PostgreSQL DB to store the data.

The application is deployed using Docker Compose, and includes a Piiano Vault container, a PostgreSQL DB container, a web based Terminal container and an Elastic stack container for viewing logs.

This demo application version is 0.8.16 and is compatible with Vault version 1.11.4 .

## How to use this demo

1. Navigate to the client web application at http://localhost:3000
2. Sign in as `Alice` with password `alice` (Member role)
3. List the customers owned by Alice
4. Create a new customer for Alice
5. Edit the customer and add a SSN

### Attack surfaces

What if an attacker gains access to the DB? Or the Web application server?

The application is deployed with a set of vulnerabilities and issues, which can be fixed using Piiano Vault. We provide some tools to simulate an attacker gaining access to the DB or the Web application server, and showcase how Piiano Vault can help mitigate the attack surface when setting the web application to run in `secure mode`:

1. Gain access to unencrypted data by querying the DB:

- When an attacker has access to database credentials - "View terminal" link, and run `./1-db-connection.sh`
- When an attacker has access to the web application backend - "View terminal" link, and run `./2-django-server-shell.sh`

With Piiano Vault, the data is encrypted in the DB and the attacker cannot decrypt it without the encryption keys.

2. IDOR (Insecure Direct Object References) - an unauthorized user can access other customer info - Sign in as John, then navigate directly to edit a customer that is not accessible by John, `http://localhost:3000/customers/3/edit`)

With Piiano Vault, the object level access control is enforced and the attacker cannot access the data.

1. SSN is masked on the client side for the Support role, also incorrectly due to lack of validation/normalization - Using the network tab in the debugging tools can see the SSN in the response. Also, the SSN is not masked in the network layer so man-in-the-middle can see the SSN.

With Piiano Vault, the SSN is masked on the server side and the attacker cannot see the SSN without privileged access.

2. Sensitive data in logs - Edit + save customer, then use "View logs" link to see the sensitive data in the application logs.

With Piiano Vault, the sensitive data is masked in the logs and the attacker cannot see the raw data.

3. One don't know who accessed the data! No access logs are saved on object level so we don't know who accessed the data and when.

With Piiano Vault, the access logs are saved and the attacker cannot access the data without leaving a trace.

4. Expiration of data - Data is not deleted after a certain period of time, so it is kept forever.

With Piiano Vault, when an expiration is set to an object, the data is expired after a certain period of time and the attacker cannot access the data after it is expired.

### Known issues

Handling issues:

1. Clean data: `./0-clear-data.sh` to reset the data to the initial state
2. Run `fix-license.sh` to fix the license if needed

## Prerequisites

- [Docker](https://www.docker.com/)
- [Piiano Vault](https://piiano.com/docs/guides/get-started)
- [Piiano Vault CLI](https://piiano.com/docs/cli/installation)

## Folder structure

The code in this directory contains a demo client in React and a set of server implementation available in common languages for a safe Customer management CRUD API with [Piiano Vault](http://piiano.com).

The server includes [1 server implementation](server/README.md) - [Python Django](/server/python-django). Each server implements several RESTful implementations, each with the same endpoints and logic.

## Running locally

To run this sample locally you need to start both a local dev server for the front-end (under `client` folder) and another server for the back-end (under `server` folder).

In addition, you will need a valid Piiano Vault service license to run Piiano Vault locally.

Follow the steps below to run locally:

1. Clone the project from GitHub:

   ```bash
   git clone https://github.com/piiano/vault-demo-react.git
   ```

2. Copy the .env.example file into a file named .env in the folder of the server you want to use. For example:

   ```bash
   cp .env.example .env
   ```

3. Obtain the Vault license from the [get started section of the guides](https://piiano.com/docs/guides/get-started/).

4. Define PVAULT_SERVICE_LICENSE as an environment variable. Alternatively, you can add it to the .env file:

   ```
   PVAULT_SERVICE_LICENSE=<your Piiano Vault license>
   ```

5. Optionally, you can modify the admin's API key in the .env file to not use the default:

   ```
   PVAULT_ADMIN_API_KEY="pvaultauth"
   ```

### With Docker Compose

The Docker Compose file includes all the required components to run this demo application, including Elastic stack for viewing logs and a web based Terminal to
mimic an attacker with access to the DB server and showcase the power of Piiano Vault to lower to minimum the attack surface.

1. Run Docker Compose

```bash
# This is so the dependencies exists on the local env, as we map it as volume into the container for simplifying development
docker compose down --volumes && docker compose build && docker compose up -d
```

2. Navigate to the client web application at http://localhost:3000

**Note:** The client and server files can be edited in run time.

## Debugging

In addition to having Elastic stack for logging, you can directly attach to the running containers to view logs, and run some debugging scripts:

### Piiano Vault

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
