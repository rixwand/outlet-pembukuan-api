# Products API

## Create Product

Endpoint : POST /product

Headers :

- Authorization : Token

Request Body :

```json
{
  "name": "string",
  "category_id": "number",
  "stock": "number",
  "basic_price": "number",
  "selling_price": "number"
}
```

Response Body Success :

```json
{
  "id": "number",
  "name": "string",
  "category": "string",
  "stock": "number",
  "basic_price": "number",
  "selling_price": "number"
}
```

Response Body Error :

```json
{
  "error": "error message"
}
```

## List All Product

Endpoint : GET /product

Headers :

- Authorization : Token

Query Params :

- filter : category id

Response Body Success :

```json
{
  "data": [
    {
      "id": "number",
      "name": "string",
      "category": "string",
      "stock": "number",
      "basic_price": "number",
      "selling_price": "number"
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

## Get Product

Endpoint : Get /product/:id

Headers :

- Authorization : Token

Response Body Success :

```json
{
  "id": "number",
  "name": "string",
  "category": "string",
  "stock": "number",
  "basic_price": "number",
  "selling_price": "number"
}
```

Response Body Error :

```json
{
  "error": "Product not found"
}
```

## Update Product

Endpoint : PUT /product/:id

Headers :

- Authorization : Token

Request Body :

```json
{
  // optional
  "name": "string",
  "category_id": "number",
  "stock": "number",
  "basic_price": "number",
  "selling_price": "number"
}
```

Response Body Success :

```json
{
  "id": "number",
  "name": "string",
  "category": "string",
  "stock": "number",
  "basic_price": "number",
  "selling_price": "number"
}
```

Response Body Error :

```json
{
  "error": "Product not found"
}
```

## Delete Product

Endpoint : DELETE /product/:id

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
  "error": "Product not found"
}
```
