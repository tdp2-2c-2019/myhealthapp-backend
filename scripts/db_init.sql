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
    lon FLOAT,
    zone VARCHAR(255)
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
    lon FLOAT,
    zone VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS authorizations (
    id SERIAL NOT NULL PRIMARY KEY,
    created_by INTEGER REFERENCES users(dni),
    created_for INTEGER REFERENCES users(dni),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255),
    title VARCHAR(255),
    note VARCHAR(255) DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE IF NOT EXISTS authorizations_history(
    authorization_id INTEGER REFERENCES authorizations(id),
    note VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS authorizations_types(
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255)
);

INSERT INTO plans("plan", "plan_name") VALUES 
(1, 'Plan 1'), 
(2, 'Plan 2'), 
(3, 'Plan 3');

INSERT INTO users("dni", "plan", "first_name", "last_name", "password", "blocked", "mail", "token", "lat", "lon") VALUES
(1, 1, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', -33.0, -43.2),
(2, 2, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', -37.1, -53.27);

INSERT INTO hospitals("minimum_plan", "name", "mail", "telephone", "address", "lat", "lon", "zone") VALUES
(1, 'Hospital Alemán', 'hospital_aleman@gmail.com', 48277000, 'Pueyrredón 1640', -33.0, -43.3, 'Parque chas'),
(2, 'Hospital Italiano', 'hospital_italiano@gmail.com', 49590300, 'Tte. Gral. Juan Domingo Perón 4190, C.A.B.A.', -37.0, -53.3, 'Belgrano');

INSERT INTO doctors("minimum_plan", "name", "mail", "telephone", "address", "address_notes", "lat", "lon", "zone") VALUES
(1, 'Jorge Perez', 'jperez@gmail.com', 47341234, 'San Juan 3100, C.A.B.A', '1 B', -33.0, -43.3, 'Saavedra'),
(2, 'Claudia Rodriguez', 'crodriguez@gmail.com', 528561, 'Matienzo 345, C.A.B.A', 'Puerta roja', -37.0, -53.3, 'Chacarita');

INSERT INTO specializations("name") VALUES
('Cardiologia'),
('Clinica'),
('Dermatologia'),
('Odontologia');

INSERT INTO languages("name") VALUES
('Español'),
('Ingles');

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

INSERT INTO authorizations("created_by", "created_for", "status", "title") VALUES
(1, 1, 'PENDING', 'Ortodoncia adultos'),
(1, 1, 'APPROVED', 'Implante dental'),
(1, 2, 'PENDING', 'Implante capilar'),
(2, 2, 'APPROVED', 'Cirugia'),
(2, 2, 'REJECTED', 'Protesis');

INSERT INTO authorizations_types("title") VALUES
('Implante'),
('Operación'),
('Rayos');
