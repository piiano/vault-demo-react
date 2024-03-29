import os
import sys
import time
import psycopg2

def wait_for_db(retry_seconds):
    for i in range(retry_seconds):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            conn.cursor().execute('SELECT 1')
            print('DB is ready!')
            return 0
        except psycopg2.OperationalError:
            print('Waiting for database...')
            time.sleep(1)
    return 1

# Wait for the database to be ready. 5 minutes should be enough.
sys.exit(wait_for_db(5*60))

