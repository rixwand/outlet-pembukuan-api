# RECEIVABLE API

## Create Receivable API

### Endpoint : POST /receivable

Header :

- Authorization : Token

Request Body :

```json
{
  "total": "number",
  "note": "string",
  "paid": "boolean",
  "sale_id": "number"
}
```

Response Body Success :

```json
{
  "data": {
    "id": "number",
    "total": "number",
    "note": "string",
    "paid": "boolean",
    "sale": {
      "name": "string",
      "category": "string",
      "created_at": "timestamp"
    }
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## GET Receivable API

### Endpoint : GET /receivable/:id

Header :

- Authorization : Token

Response Body Success :

```json
{
  "data": {
    "id": "number",
    "total": "number",
    "note": "string",
    "paid": "boolean",
    "sale": {
      "name": "string",
      "category": "string",
      "created_at": "timestamp"
    }
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## Update Receivable API

### Endpoint : PUT /receivable/:id

Header :

- Authorization : Token

Request Body :

```json
{
  "total": "number",
  "note": "string",
  "paid": "boolean"
}
```

Response Body Success :

```json
{
  "data": {
    "id": "number",
    "total": "number",
    "note": "string",
    "paid": "boolean",
    "sale": {
      "name": "string",
      "category": "string",
      "created_at": "timestamp"
    }
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## Delete Receivable API

### Endpoint : DELETE /receivable/:id

Header :

- Authorization : Token

Response Body Success :

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

## List Receivable API

### Endpoint : GET /receivable?filter

Header :

- Authorization : Token

Query :

- Search = with Receivable notes or sale name or sale category
- time = beetwen dates, default this week
- paid = boolean, default get all type receivable

Response Body Success :

```json
{
  "data": [
    {
      "id": "number",
      "total": "number",
      "note": "string",
      "paid": "boolean",
      "sale": {
        "name": "string",
        "category": "string",
        "created_at": "timestamp"
      }
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
