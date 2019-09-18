CREATE TABLE IF NOT EXISTS plans (
    plan INTEGER NOT NULL PRIMARY KEY,
    plan_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    dni INTEGER NOT NULL PRIMARY KEY,
    plan INTEGER REFERENCES plans(plan),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255),
    blocked BOOLEAN,
    mail VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS hospitals (
    id INTEGER NOT NULL PRIMARY KEY,
    minimum_plan INTEGER REFERENCES plans(plan),
    name VARCHAR(255),
    lat FLOAT,
    lon FLOAT
);

CREATE TABLE IF NOT EXISTS specializations (
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER NOT NULL PRIMARY KEY,
    minimum_plan INTEGER REFERENCES plans(plan),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    mail VARCHAR(255),
    lat FLOAT,
    lon FLOAT
);

INSERT INTO plans("plan", "plan_name") VALUES 
(1, 'Plan 1'), 
(2, 'Plan 2'), 
(3, 'Plan 3');

INSERT INTO users("dni", "plan", "first_name", "last_name", "password", "blocked", "mail") VALUES
(1, 1, 'Diego', 'Armando', 'password', false, 'diego@mail.com'),
(2, 2, 'Claudio', 'Paul', 'password', false, 'claudio@paul.com');

INSERT INTO hospitals("id", "minimum_plan", "name", "lat", "lon") VALUES
(1, 1, 'hospital1', -33.0, -43.3),
(2, 2, 'hospital2', -37.0, -53.3);