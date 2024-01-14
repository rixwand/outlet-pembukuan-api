# User Api

## Login

### GET /api/user/login

- Request Body

```json
{
  "email": "strig",
  "password": "string"
}
```

- Response Body

```json
{
  "access_token": "string",
  "refresh_token": "string"
}
```

## Register

### POST /api/user/register

- Request Body

```json
{
  "name": "string",
  "email": "strig",
  "password": "string"
}
```

- Response Body

```json
{
  "name": "string",
  "email": "string"
}
```

## Update User API

Endpoint : PATCH /api/user/current

Headers :

- Authorization : token

Request Body :

```json
{
  "username": "Rixwand", // optional
  "password": "123456" // optional
}
```

Response Body :

```json
{
  "data": {
    "username": "riz",
    "email": "rix@gmail.com"
  }
}
```

Response error :

```json
{
  "error": "error message"
}
```

## Get User

### Get /api/user

Headers :

- authirization : token

Response Body Success :

```json
{
  "data": {
    "name": "string",
    "email": "string"
  }
}
```

Response Body Error :

```json
{
  "error": "Unauthorized"
}
```

## Logout

### DELETE /auth/logout

Headers :

- authirization : token

Response Body Success :

```json
{
  "data": "logout"
}
```

Response Body Error :

```json
{
  "error": "Unauthorized"
}
```
