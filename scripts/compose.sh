#!/bin/bash

echo "Waiting for the database to become ready"
pg_isready --dbname="donationsdb" --host="roach1" --port=26257 --username="donation_mgmt_migrator" --timeout=0 --quiet

echo "Database is ready to go. Applying migrations"
npm run migrate:latest

npm run dev
