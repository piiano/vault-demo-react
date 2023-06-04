#!/bin/sh

wait_until_containers_are_up()
{
    # Wait for containers to be healthy
    echo "Waiting for containers to be up and running..."
    sleep 3

    start_time=$(date +%s)
    timeout=$((start_time + 300))  # 5 minutes timeout

    while true; do
        # Get the status of each service defined in the Docker Compose file
        container_status=$(docker-compose ps -q)

        # Check if all containers are running
        if [ -n "$container_status" ]; then
            all_running=true

            # Iterate over each container and check its health status
            while IFS= read -r container_id; do
                health_status=$(docker inspect --format='{{json .State.Status}}' "$container_id")
                name=$(docker inspect --format='{{json .Name}}' "$container_id")
                echo "Checking - $name $container_id == $health_status"

                # If any container is not running or healthy, set the flag to false
                if [ $name != "/vault-demo-init-1" ] ; then 
                    if [ "$health_status" != "\"running\"" ]; then
                        all_running=false
                        echo "${name} still down $health_status ..."
                        docker-compose logs
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
        current_time=$(date +%s)
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


check_log_for_pattern() 
{
    local service_name=$1
    local pattern=$2
    local attempt=1
    local max_attempts=10
    
    while [ $attempt -le $max_attempts ]; do
        # Check if the pattern exists in the Docker log. Notice usage of docker compose logs
        # regular docker logs open a new process so you can't redirect stdout easily
        if docker compose logs | grep $service_name | grep -q "$pattern"; then
            echo "Pattern found in $service_name!"
            return 0
        fi
    
        echo "Pattern not found in $service_name. Attempt $attempt of $max_attempts"
    
        # Wait for a few seconds before the next attempt
        sleep 5
    
        attempt=$((attempt + 1))
    done
    
    echo "Pattern not found in $service_name after $max_attempts attempts. Bailing out..."
    return 1
}

wait_until_vault_is_up()
{
    check_log_for_pattern "vault-demo-piiano-vault-1" "Serving HTTP on 0.0.0.0:8123"
    if [ "$?" -eq 1 ] ; then
        exit 1
    fi
}

wait_until_react_is_up()
{
    check_log_for_pattern "vault-demo-client-1" "webpack compiled successfully" 
    if [ "$?" -eq 1 ] ; then
        exit 1
    fi
}

check_web_is_answering()
{
    curl --no-progress-meter --connect-timeout 30 http://127.0.0.1:3000 | grep -q "Piiano Vault demo using React"
    if [ $? = "0" ] ; then
        echo "React application is up"    
        return 0
    else
        echo "React app is unresponsive after 30 seconds. Bailing out..."
        return 1
    fi
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
wait_until_react_is_up
check_web_is_answering
docker compose down
