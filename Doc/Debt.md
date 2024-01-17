# DEBT API

## Create Debt API

### Endpoint : POST /debt

Headers :

- Authorization : Token

Request Body :

```json
{
  "note": "string",
  "total": "number",
  "paid": "boolean"
}
```

Response Body success:

```json
{
  "data": {
    "note": "string",
    "total": "number",
    "paid": "boolean",
    "expense": {
      "name": "string",
      "created_at": "timestamp"
    } // or null
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## GET Debt API

### Endpoint : POST /debt/:id

Headers :

- Authorization : Token

Response Body success:

```json
{
  "data": {
    "id": "number",
    "note": "string",
    "total": "number",
    "paid": "boolean",
    "created_at": "timestamp",
    "expense": {
      "name": "string",
      "created_at": "timestamp"
    } // or null
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## Update Debt API

### Endpoint : PUT /debt/:id

Headers :

- Authorization : Token

Request Body :

```json
{
  "note": "string",
  "total": "number",
  "paid": "boolean"
}
```

Response Body success:

```json
{
  "data": {
    "id": "number",
    "note": "string",
    "total": "number",
    "paid": "boolean",
    "created_at": "timestamp",
    "expense": {
      "name": "string",
      "created_at": "timestamp"
    } // or null
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## Delete Debt API

### Endpoint : DELETE /debt/:id

Headers :

- Authorization : Token

Response Body success:

```json
{
  "data": {
    "id": "number"
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## List Debt API

### Endpoint : GET /debt?filter

Header :

- Authorization : Token

Query :

- Search = with debt notes or expense name
- time = beetwen dates, default this week, format : DD-MM-YYYY
- paid = boolean, default get all type debt

Response Body Success :

```json
{
  "data": [
    {
      "id": "number",
      "note": "string",
      "total": "number",
      "paid": "boolean",
      "created_at": "timestamp",
      "expense": {
        "name": "string",
        "created_at": "timestamp"
      } // or null
    }
  ]
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```
