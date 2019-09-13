create TABLE IF NOT EXISTS plans (
    plan INTEGER NOT NULL primary key,
    plan_name VARCHAR(255)
    );

create table if not EXISTS users (
    dni integer not null primary key,
    plan integer references plans(plan),
    first_name varchar(255),
    last_name varchar(255),
    password VARCHAR(255),
    blocked BOOLEAN,
    mail VARCHAR(255)
);

create table if not exists hospitals (
    id integer not null primary key,
    minimum_plan integer REFERENCES plans(plan),
    name VARCHAR(255),
    lat FLOAT,
    lon float
);

create table if not exists specializations (
    id integer not null primary key,
    name VARCHAR(255)
);

create table if not exists doctors (
    id integer not null primary key,
    minimum_plan integer references plans(plan),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    mail VARCHAR(255),
    lat float,
    lon float
    );

insert into plans("plan", "plan_name") values 
(1, 'Plan 1'), 
(2, 'Plan 2'), 
(3, 'Plan 3');

insert into users("dni", "plan", "first_name", "last_name", "password", "blocked", "mail") VALUES
(1, 1, 'Diego', 'Armando', 'password', false, 'diego@mail.com'),
(2, 2, 'Claudio', 'Paul', 'password', false, 'claudio@paul.com');

insert into hospitals("id", "minimum_plan", "name", "lat", "lon") VALUES
(1, 1, 'hospital1', -33.0, -43.3),
(2,
 2,
 'hospital2',
 -37.0,
 -53.3);