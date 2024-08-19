#!/bin/sh

wait_until_containers_are_up()
{
    # Wait for containers to be healthy
    echo "Waiting for containers to be up and running..."
    sleep 3

    start_time=$(date +%s)
    timeout=$((start_time + 300))  # 5 minutes timeout
    debug_timeout=$((start_time + 60))  # 1 minutes timeout

    while true; do
        # Get the status of each service defined in the Docker Compose file
        container_status=$(docker compose ps -q)
        current_time=$(date +%s)

        # Check if all containers are running
        if [ -n "$container_status" ]; then
            all_running=true

            # Iterate over each container and check its health status
            while IFS= read -r container_id; do
                health_status=$(docker inspect --format='{{json .State.Status}}' "$container_id")
                name=$(docker inspect --format='{{json .Name}}' "$container_id")

                # If any container is not running or healthy, set the flag to false
                if [ $name = "\"/vault-demo-init-1\"" ] ; then 
                    echo "Ignoring init container - should not be up"
                else
                    echo "Checking - $name $container_id == $health_status"
                    if [ "$health_status" != "\"running\"" ]; then
                        all_running=false
                        echo "${name} still down $health_status ..."
                        if [ "$current_time" -gt "$debug_timeout" ]; then
                            echo "Enabling Debug after 1 minute"
                            docker ps
                            docker compose logs
                        fi
                        break
                    fi
                fi
            done <<< "$container_status"

            # If all containers are running and healthy, exit the loop
            if [ "$all_running" = true ]; then
                break
            fi
        fi

        # Check if timeout has been reached
        if [ "$current_time" -gt "$timeout" ]; then
            echo "Timeout reached. Containers did not start within 5 minutes."
            docker ps
            exit 1
        fi

        # Wait for a few seconds before checking the status again
        sleep 5
    done

    echo "All containers are up and running!"
}

wait_until_vault_is_up()
{
    ./wait-for-service.sh http://localhost:8123/api/pvlt/1.0/ctl/info/health
}

check_vault_health()
{
    echo "Vault healthcheck..."
    d=`curl --no-progress-meter http://localhost:8123/api/pvlt/1.0/ctl/info/health | jq -r ".status"`
    c=`curl --no-progress-meter http://localhost:8123/api/pvlt/1.0/data/info/health | jq -r ".status"`

    if [[ $d != "pass" ]] || [[ $c != "pass" ]]; then
        echo "Failed healhcheck: data $d control $c"
        exit 1
    else
        echo "Vault healthcheck passed"
    fi
}

wait_until_react_is_up()
{
    local attempt=1
    local max_attempts=15
    
    while [ $attempt -le $max_attempts ]; do

        curl --no-progress-meter --connect-timeout 2 http://127.0.0.1:3000 | grep -q "Piiano Vault demo using React"
        if [ $? = "0" ] ; then
            echo "React application is up"    
            return 0
        else
            echo "React up still down, attempt ${attempt}"
        fi

        sleep 1
        attempt=$((attempt + 1))
    done

    echo "Web is not up after $attempts attempts. Bailing out..."
    exit 1
}

# main
echo "Basic system test"

services="init db server-python-django vaultdb piiano-vault client"

# first optional parameter is to run with minimal mode (no elk and no terminal)
if [ \( -n "$1" \) -a \( "$1" = "--minimal" \) ]; then
  echo "starting only basic services $services"
  docker compose build $services && docker compose up -d $services 
else 
  echo "starting all services $services"
  docker compose build && docker compose up -d
fi

wait_until_containers_are_up
wait_until_vault_is_up
check_vault_health
wait_until_react_is_up
docker compose down
