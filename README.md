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

### Login

#### `POST` /api/login

Logs in the given user, returning a valid token

Auth: No

Expected body:

```json
    {
        "dni": "99",
        "password": "password"
    }
```

Response status: 200, 403

Response body 200: 

```json
    {
        "message": "Authentication successful!",
        "token": "your_super_secret_token"
    }
```

Response body 403: 

```json
    {
        "error": "Your user is blocked, please contact helpdesk OR Incorrect username or password",
    }
```


### Users

#### `POST` /api/users

Creates a user if the given DNI exists in the DB

Auth: No

Expected body:

```json
    {
        "dni": "99",
        "password": "password",
        "mail": "diego@armando.com"
    }
```

Response status: 201
