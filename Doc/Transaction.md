# Transaction API

## Add Sale API

endpoint : POST /transaction/sale

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "string",
  "category": "string",
  "basic_price": "number",
  "selling_price": "number",
  "receivable": "string"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "int",
    "name": "string",
    "category": "string",
    "basic_price": "number",
    "selling_price": "number",
    "receivable": "string",
    "created_at": "string"
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
  "name": "string",
  "total": "number"
}
```

Response Body Success:

```json
{
  "data": {
    "id": "string",
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
        "type": "penjualan",
        "created_at": "timestamp"
      },
      {
        "id": "number",
        "jenis": "string",
        "total": "number",
        "type": "pengeluaran",
        "created_at": "timestamp"
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

## Update Expense

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
