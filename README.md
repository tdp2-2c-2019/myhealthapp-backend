# MyHealthApp Backend

[![Build Status](https://travis-ci.org/tdp2-2c-2019/myhealthapp-backend.svg?branch=master)](https://travis-ci.org/tdp2-2c-2019/myhealthapp-backend)

Server + Admin of MyHealthApp

## Requirements

- PostgreSQL
- Node 10


## Run locally

A local server of postgresql should be running under postgres://$USER:@localhost:5432/postgres

```bash
npm run dev
```

## Endpoints

### Users

#### `POST` /api/users

Creates a user if the given DNI exists in the DB

Expected body:

```json
    {
        "dni": "99",
        "password": "password",
        "mail": "diego@armando.com"
    }
```

Response: 201
