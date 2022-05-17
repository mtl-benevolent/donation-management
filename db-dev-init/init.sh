#!/usr/bin/env bash
connected=false

until [ connected ]
do
  if cockroach sql --execute="SELECT 1" --echo-sql; then
    connected=true
  fi
done

cockroach sql -f /db-init/create-db.sql

echo "DB Initialized"
