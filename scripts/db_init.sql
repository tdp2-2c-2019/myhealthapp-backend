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
    mail VARCHAR(255),
    token VARCHAR(255),
    lat FLOAT,
    lon FLOAT
);

CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL NOT NULL PRIMARY KEY,
    minimum_plan INTEGER REFERENCES plans(plan),
    name VARCHAR(255),
    mail VARCHAR(255),
    telephone INTEGER,
    address VARCHAR(255),
    lat FLOAT,
    lon FLOAT
);

CREATE TABLE IF NOT EXISTS specializations (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS languages (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL NOT NULL PRIMARY KEY,
    minimum_plan INTEGER REFERENCES plans(plan),
    name VARCHAR(255),
    mail VARCHAR(255),
    telephone INTEGER,
    address VARCHAR(255),
    address_notes VARCHAR(255),
    lat FLOAT,
    lon FLOAT
);

CREATE TABLE IF NOT EXISTS doctors_specializations (
    doctor_id INTEGER REFERENCES doctors(id),
    specialization_id INTEGER REFERENCES specializations(id),
    PRIMARY KEY (doctor_id, specialization_id)
);

CREATE TABLE IF NOT EXISTS hospitals_specializations (
    hospital_id INTEGER REFERENCES hospitals(id),
    specialization_id INTEGER REFERENCES specializations(id),
    PRIMARY KEY (hospital_id, specialization_id)
);

CREATE TABLE IF NOT EXISTS doctors_languages (
    doctor_id INTEGER REFERENCES doctors(id),
    language_id INTEGER REFERENCES languages(id),
    PRIMARY KEY (doctor_id, language_id)
);

CREATE TABLE IF NOT EXISTS hospitals_languages (
    hospital_id INTEGER REFERENCES hospitals(id),
    language_id INTEGER REFERENCES languages(id),
    PRIMARY KEY (hospital_id, language_id)
);

INSERT INTO plans("plan", "plan_name") VALUES 
(1, 'Plan 1'), 
(2, 'Plan 2'), 
(3, 'Plan 3');

INSERT INTO users("dni", "plan", "first_name", "last_name", "password", "blocked", "mail", "token", "lat", "lon") VALUES
(1, 1, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', -33.0, -43.2),
(2, 2, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', -37.1, -53.27);

INSERT INTO hospitals("id", "minimum_plan", "name", "mail", "telephone", "address", "lat", "lon") VALUES
(1, 1, 'Hospital Alemán', 'hospital_aleman@gmail.com', 48277000, 'Pueyrredón 1640', -33.0, -43.3),
(2, 2, 'Hospital Italiano', 'hospital_italiano@gmail.com', 49590300, 'Tte. Gral. Juan Domingo Perón 4190, C.A.B.A.', -37.0, -53.3);

INSERT INTO doctors("id", "minimum_plan", "name", "mail", "telephone", "address", "address_notes", "lat", "lon") VALUES
(1, 1, 'Jorge Perez', 'jperez@gmail.com', 47341234, 'San Juan 3100, C.A.B.A', '1 B', -33.0, -43.3),
(2, 2, 'Claudia Rodriguez', 'crodriguez@gmail.com', 528561, 'Matienzo 345, C.A.B.A', 'Puerta roja', -37.0, -53.3);

INSERT INTO specializations("id", "name") VALUES
(1, 'Cardiologia'),
(2, 'Clinica'),
(3, 'Dermatologia'),
(4, 'Odontologia');

INSERT INTO languages("id", "name") VALUES
(1, 'Español'),
(2, 'Ingles');

INSERT INTO doctors_specializations("doctor_id", "specialization_id") VALUES
(1, 1),
(1, 2),
(2, 4);

INSERT INTO doctors_languages("doctor_id", "language_id") VALUES
(1, 1),
(2, 1),
(2, 2);

INSERT INTO hospitals_specializations("hospital_id", "specialization_id") VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2);

INSERT INTO hospitals_languages("hospital_id", "language_id") VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2);