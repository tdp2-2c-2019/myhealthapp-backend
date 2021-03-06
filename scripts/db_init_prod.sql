CREATE TABLE IF NOT EXISTS plans (
    plan INTEGER NOT NULL PRIMARY KEY,
    plan_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    dni INTEGER NOT NULL PRIMARY KEY,
    affiliate_id CHAR(10) UNIQUE,
    plan INTEGER REFERENCES plans(plan),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password VARCHAR(255),
    blocked BOOLEAN,
    mail VARCHAR(255),
    token VARCHAR(255),
    firebase_token VARCHAR(255)
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

CREATE TABLE IF NOT EXISTS authorizations_types(
    id SERIAL NOT NULL PRIMARY KEY,
    minimum_plan INTEGER REFERENCES plans(plan),
    title VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS authorizations (
    id SERIAL NOT NULL PRIMARY KEY,
    type INTEGER REFERENCES authorizations_types(id),
    created_by INTEGER REFERENCES users(dni),
    created_for INTEGER REFERENCES users(dni),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255),
    title VARCHAR(255),
    note VARCHAR(255) DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(255) DEFAULT '',
    photo BYTEA
);

CREATE TABLE IF NOT EXISTS authorizations_history (
    authorization_id INTEGER REFERENCES authorizations(id),
    note VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

INSERT INTO users("dni", "affiliate_id", "plan", "first_name", "last_name", "password", "blocked", "mail", "token", "firebase_token") VALUES
(1, '1234567800', 1, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(2, '1234567801', 2, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', ''),
(38549029, '1111222200', 3, 'Juan Carlos', 'Zapater', NULL, false, 'jzapater@gmail.com', '', '');

INSERT INTO hospitals("minimum_plan", "name", "mail", "telephone", "address", "lat", "lon", "zone") VALUES
(1, 'Hospital Alemán', 'hospital_aleman@gmail.com', 48277000, 'Av. Pueyrredón 1640, C1118 AAT, Buenos Aires', -34.5885075, -58.4045567, 'Recoleta'),
(2, 'Hospital Italiano', 'hospital_italiano@gmail.com', 49590300, 'Teniente, General, Juan Domingo 4190 Perón, C1015 CABA', -34.6073401, -58.407688, 'Balvanera'),
(2, 'Hospital General de Niños Pedro de Elizalde', 'contacto@hgeneral.com', 43632100, 'Av. Montes de Oca 40, C1270AAN CABA', -34.625382, -58.3766944, 'Constitución'),
(1, 'Hospital General de Agudos Dr. Cosme Argerich', 'contacto@argerich.com', 41210700, 'Pi y Margall 750, C1155AHD CABA', -34.6254242, -58.372195, 'Almte. Brown'),
(3, 'Hospital Británico de Buenos Aires', 'contacto@hbritanico.com', 43096400, 'Perdriel 74, C1280 AEB, Buenos Aires', -34.6313887, -58.3830426, 'Constitución'),
(3, 'Sanatorio De Los Arcos', 'contacto@delosarcos.com.ar', 47784500, 'Av. Juan B. Justo 909, C1425 FSD, Buenos Aires', -34.5809487, -58.4317812, 'Palermo');

INSERT INTO doctors("minimum_plan", "name", "mail", "telephone", "address", "address_notes", "lat", "lon", "zone") VALUES
(1, 'Jorge Perez', 'jperez@gmail.com', 47341234, 'San Juan 3100, CABA', '1 B', -34.6238033, -58.409406, 'San Cristobal'),
(2, 'Claudia Rodriguez', 'crodriguez@gmail.com', 528561, 'Chile 394, CABA', 'Casa amarilla', -34.6153973, -58.3869546, 'San Telmo'),
(3, 'Santiago Martinez', 'smartinez@gmail.com', 47885429, 'Juncal 2781, C1425AYG Ciudad Autonoma de Buenos Aires, Buenos Aires', '',  -34.5893573, -58.4122768, 'Barrio Norte'),
(2, 'Leandro Alem', 'lalem@gmail.com', 43156801, 'Av. Alicia Moreau de Justo 1714, Buenos Aires', 'Dock 4', -34.6181071, -58.375804, 'Puerto Madero');

INSERT INTO specializations("name") VALUES
('Cardiología'),
('Clínica'),
('Dermatología'),
('Odontología'),
('Oftamología');

INSERT INTO languages("name") VALUES
('Español'),
('Inglés'),
('Portugués');

INSERT INTO doctors_specializations("doctor_id", "specialization_id") VALUES
(1, 1), (1, 2),
(2, 4),
(3, 5),
(4, 2);

INSERT INTO doctors_languages("doctor_id", "language_id") VALUES
(1, 1),
(2, 1), (2, 2),
(3, 1), (3, 3),
(4, 1), (4, 2);

INSERT INTO hospitals_specializations("hospital_id", "specialization_id") VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 1), (3, 2),
(4, 1), (4, 3),
(5, 2), (5, 3), (5, 4),
(6, 1), (6, 2), (6, 5);

INSERT INTO hospitals_languages("hospital_id", "language_id") VALUES
(1, 1), (1, 2),
(2, 1), (2, 2),
(3, 1),
(4, 1), (4, 2),
(5, 1),
(6, 1), (6, 2);

INSERT INTO authorizations_types ("minimum_plan", "title") VALUES
(3, 'Implante'),
(2, 'Operación'),
(1, 'Rayos');

INSERT INTO authorizations("type", "created_by", "created_for", "status", "title", "approved_by") VALUES
(1, 1, 1, 'PENDIENTE', 'Ortodoncia adultos'),
(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM'),
(2, 1, 2, 'PENDIENTE', 'Implante capilar'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL'),
(2, 2, 2, 'RECHAZADO', 'Prótesis');

-- Demo data
INSERT INTO authorizations
    ("type", "created_by", "created_for", "status", "title", "approved_by", "updated_at")
VALUES
    (1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '21 day'),
    (2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '21 day'),
    (2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '25 day'),

(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '7 day'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '20 day'),
(2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '29 day'),

(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '15 day'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '13 day'),
(2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '13 day'),

(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '10 day'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '24 day'),
(2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '27 day'),

(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '4 day'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '19 day'),
(2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '23 day'),

(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '28 day'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '11 day'),
(2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '10 day'),

(1, 1, 1, 'APROBADO', 'Implante dental', 'SYSTEM', NOW() - INTERVAL '16 day'),
(2, 2, 2, 'APROBADO', 'Cirugía', 'MANUAL', NOW() - INTERVAL '3 day'),
(2, 2, 2, 'RECHAZADO', 'Prótesis', '', NOW() - INTERVAL '25 day');

INSERT INTO users("dni", "affiliate_id", "plan", "first_name", "last_name", "password", "blocked", "mail", "token", "firebase_token") VALUES
(100, '82038102', 1, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(101, '203981203', 3, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(102, '123091823', 3, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', ''),
(103, '0394034', 1, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(104, '34342342', 2, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', ''),
(105, '9489384', 1, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(106, '0303456', 3, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', ''),
(107, '02808111', 2, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(108, '932998948', 2, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', ''),
(109, '338889944', 3, 'Diego', 'Armando', NULL, false, 'diego@mail.com', '', ''),
(110, '12133300', 1, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', ''),
(111, '232348984', 1, 'Claudio', 'Paul', NULL, false, 'claudio@paul.com', '', '');