#!/usr/bin/env bash
connected=false

until $connected
do
  cockroach sql --execute="SELECT 1";

  if [ $? -eq 0 ]; then
    echo "DB is available"
    connected=true
  else
    sleep 5;
  fi
done

cockroach sql -f /db-init/create-db.sql --echo-sql

echo "DB Initialized"
