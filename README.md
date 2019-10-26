# MyHealthApp Backend

[![Build Status](https://travis-ci.org/tdp2-2c-2019/myhealthapp-backend.svg?branch=master)](https://travis-ci.org/tdp2-2c-2019/myhealthapp-backend)

Server + Admin of MyHealthApp

## Requirements

- PostgreSQL
- Node 10


## Run locally

A local server of postgresql should be running under postgres://$USER:@localhost:5432/postgres.

```bash
npm run dev
```

## Endpoints

### Login

#### `POST` /api/login

Logs in the given user, returning a valid token.

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

Creates a user if the given DNI exists in the DB.

Auth: No

Expected body:

```json
    {
        "dni": "99",
        "password": "password",
        "mail": "diego@armando.com",
        "first_name": "Diego",
        "last_name": "Armando",
        "plan": "1"
    }
```

Response status: 201

#### `POST` /api/users/account/recover

Sends an email to the given mail with a token to reset the password

Auth: No

Expected body:

```json
    {
        "mail": "diego@armando.com"
    }
```

Response status: 200

#### `PUT` /api/users/password

Resets the users password if the token ius valid

Auth: No

Expected body:

```json
    {
        "password": "apassword",
        "token": "asdbc"
    }
```

Response status: 200

### Health Services
#### `GET` /api/health-services
Returns all hospitals and doctors.

Auth: Yes

Response body 200:

```json
[
    {
        "id": 1,
        "minimum_plan": 1,
        "name": "hospital1",
        "lat": -33,
        "lon": -43.3
    },
    {
        "id": 1,
        "minimum_plan": 1,
        "name": "Jorge Perez",
        "lat": -33,
        "lon": -43.3
    }
]
```

#### `GET` /api/health-services/hospitals
Returns all hospitals.

Auth: Yes

Query parameters: name (string), specialization (string)

Response body 200:

```json
[
    {
        "id": 1,
        "minimum_plan": 1,
        "name": "hospital1",
        "lat": -33,
        "lon": -43.3
    },
    {
        "id": 2,
        "minimum_plan": 2,
        "name": "hospital2",
        "lat": -37,
        "lon": -53.3
    }
]
```

#### `GET` /api/health-services/doctors
Returns all doctors.

Auth: Yes

Query parameters: name (string), specialization (string)

Response body 200:

```json
[
    {
        "id": 1,
        "minimum_plan": 1,
        "name": "Jorge Perez",
        "lat": -33,
        "lon": -43.3
    },
    {
        "id": 2,
        "minimum_plan": 2,
        "name": "Claudia Rodriguez",
        "lat": -37,
        "lon": -53.3
    }
]
```

#### `GET` /api/health-services/hospitals/:id
Returns hospital with selected ID.

Response status: 200, 404

Response body 200:

```json
{
    "id": 1,
    "minimum_plan": 1,
    "name": "hospital1",
    "lat": -33,
    "lon": -43.3
}
```

Response body 404:

```json
{
    "error": "Hospital not found"
}
```

#### `GET` /api/health-services/doctors/:id
Returns doctor with selected ID.

Response status: 200, 404

Response body 200:

```json
{
    "id": 1,
    "minimum_plan": 1,
    "name": "Jorge Perez",
    "mail": "jperez@gmail.com",
    "lat": -33,
    "lon": -43.3
}
```

Response body 404:

```json
{
    "error": "Doctor not found"
}
```
### Languages
#### `GET` /api/languages
Returns all languages.

Response body 200:

```json
[
    {
        "id": 1,
        "name": "Español"
    },
    {
        "id": 2,
        "name": "Ingles"
    }
]
```
### Plans
#### `GET` /api/plans
Returns all plans.

Response body 200:

```json
[
    {
        "plan": 1,
        "plan_name": "Plan 1"
    },
    {
        "plan": 2,
        "plan_name": "Plan 2"
    },
    {
        "plan": 3,
        "plan_name": "Plan 3"
    }
]
```
### Specializations
#### `GET` /api/specializations
Returns all specializations.

Response body 200:

```json
[
    {
        "id": 1,
        "name": "Cardiologia"
    },
    {
        "id": 2,
        "name": "Clinica"
    },
    {
        "id": 3,
        "name": "Dermatologia"
    },
    {
        "id": 4,
        "name": "Odontologia"
    }
]
```
### Zones
#### `GET` /api/zones
Returns all zones.

Response body 200:

```json
[
    "Belgrano",
    "Saavedra"
]
```

### Authorizations
#### `GET` /api/authorizations
Returns all authorizations.

Response body 200:

```json
[
  {
    "id": 1,
    "created_by": {
      "dni": 1,
      "plan": 1,
      "first_name": "Diego",
      "last_name": "Armando",
      "password": null,
      "blocked": false,
      "mail": "diego@mail.com",
      "token": "",
      "lat": -33,
      "lon": -43.2
    },
    "created_for": {
      "dni": 1,
      "plan": 1,
      "first_name": "Diego",
      "last_name": "Armando",
      "password": null,
      "blocked": false,
      "mail": "diego@mail.com",
      "token": "",
      "lat": -33,
      "lon": -43.2
    },
    "created_at": "2019-10-24T18:23:38.991Z",
    "status": "PENDING",
    "title": "Ortodoncia adultos"
  }
]
```

#### `GET` /api/authorizations/:id
Returns authorization with given id

Response body 200:

```json
{
"id": 1,
"created_by": {
    "dni": 1,
    "plan": 1,
    "first_name": "Diego",
    "last_name": "Armando",
    "password": null,
    "blocked": false,
    "mail": "diego@mail.com",
    "token": "",
    "lat": -33,
    "lon": -43.2
},
"created_for": {
    "dni": 1,
    "plan": 1,
    "first_name": "Diego",
    "last_name": "Armando",
    "password": null,
    "blocked": false,
    "mail": "diego@mail.com",
    "token": "",
    "lat": -33,
    "lon": -43.2
},
"created_at": "2019-10-24T18:23:38.991Z",
"status": "PENDING",
"title": "Ortodoncia adultos"
}
```
