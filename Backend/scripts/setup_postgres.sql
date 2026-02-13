-- Run as superuser (e.g. connect to database "postgres" in Beekeeper).
-- Step 1: Create user (change 'strongpassword' to your own)
CREATE USER publicvoice_user WITH PASSWORD 'strongpassword';

-- Step 2: Create database
CREATE DATABASE publicvoice_db OWNER publicvoice_user;

-- Step 3: Connect to publicvoice_db (in Beekeeper: new connection, database = publicvoice_db)
--        then run the line below to allow tables to be created:
-- GRANT ALL ON SCHEMA public TO publicvoice_user;
