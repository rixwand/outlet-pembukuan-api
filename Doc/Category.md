# Category API

## Create Category

Endpoint : POST /category

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "string"
}
```

Response Body Success :

```json
{
  "id": "number",
  "name": "string"
}
```

Response Body Error :

```json
{
  "error": "error message"
}
```

## List All Category

Endpoint : GET /category

Headers :

- Authorization : Token

Response Body Success :

```json
{
  "data": [
    {
      "id": "number",
      "name": "string"
    }
  ]
}
```

Response Body Error :

```json
{
  "error": "no record found"
}
```

## Update Category

Endpoint : PUT /category/:id

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "string"
}
```

Response Body Success :

```json
{
  "id": "number",
  "name": "string"
}
```

Response Body Error :

```json
{
  "error": "Category not found"
}
```

## Delete Category

Endpoint : DELETE /category/:id

Headers :

- Authorization : Token

Response Body Success :

```json
{
  "id": "number"
}
```

Response Body Error :

```json
{
  "error": "Category not found"
}
```
