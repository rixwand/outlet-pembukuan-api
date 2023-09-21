# Transaction API

## Add Sale API

endpoint : POST /transaction/sale

Headers :

- Authorization : token

Request Body :

```json
{
  "product_id": "string",
  "piutang": "boolean"
}
```

Response Body Success:

```json
{
  "data": {
    "product_id": "int"
  }
}
```

Response Body Error:

```json
{
  "error": "error message"
}
```

## Add Expense API

endpoint : POST /transaction/expense

Headers :

- Authorization : token

Request Body :

```json
{
  "jenis": "string",
  "total": "number"
}
```

Response Body Success:

```json
{
  "data": {
    "jenis": "string",
    "total": "number"
  }
}
```

Response Body Error:

```json
{
  "error": "error message"
}
```

## Get List Transaction

Endpoint : GET /transaction

Headers :

- Authorization : token

Response Body Success:

```json
{
  "data": {
    "transaction": [
      {
        "id": "number",
        "name": "string",
        "category": "string",
        "harga_dasar": "number",
        "harga_jual": "number",
        "type": "penjualan"
      },
      {
        "id": "number",
        "jenis": "string",
        "total": "number",
        "type": "pengeluaran"
      }
    ]
  }
}
```

Response Body Error :

```json
{
  "error": "Error message"
}
```

## Get Transaction API

Endpoint : DELETE /transaction/:type/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "penjualan": {},
    // or
    "pengeluaran": {}
  }
}
```

Response Body Error :

```json
{
  "error": "transaction not found"
}
```

## Delete Transaction API

Endpoint : DELETE /transaction/:type/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "deleted ${type} success"
}
```

Response Body Error :

```json
{
  "error": "deleted ${type} failed, ${message}"
}
```

## Update Transaction

Endpoint : PUT /transaction/:type/:id

Request Body :

```json
// data properties penjualan atau pengeluaran
{
  "penjualan": {},
  // or
  "pengeluaran": {}
}
```

Response Body Success :

```json
// updated properties penjualan atau pengeluaran
{
  "penjualan": {},
  // or
  "pengeluaran": {}
}
```
