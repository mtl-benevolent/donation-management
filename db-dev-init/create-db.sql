CREATE DATABASE IF NOT EXISTS donationsdb;
CREATE SCHEMA IF NOT EXISTS donationsdb.donations;

-- Creating the roles
CREATE ROLE IF NOT EXISTS donations_rw;
CREATE ROLE IF NOT EXISTS donations_migrators;

-- Setting up donations_rw role
GRANT CONNECT ON DATABASE donationsdb TO donations_rw;
GRANT USAGE ON SCHEMA donationsdb.donations TO donations_rw;

-- Setting up donations_migrations role
GRANT donations_rw TO donations_migrators;
GRANT CREATE ON DATABASE donationsdb TO donations_migrators;
GRANT CREATE ON SCHEMA donationsdb.donations TO donations_migrators;

-- Creating application user
CREATE USER IF NOT EXISTS donation_mgmt_app LOGIN PASSWORD NULL;
GRANT donations_rw TO donation_mgmt_app;

-- Creating migration user
CREATE USER IF NOT EXISTS donation_mgmt_migrator LOGIN PASSWORD NULL;
GRANT donations_migrators TO donation_mgmt_migrator;
