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
  // optional
  "receivable": {
    "note": "string",
    "total": "number",
    "paid": "boolean" //default False
  }
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
    "created_at": "string",
    // optional
    "receivable": {
      "total": "number",
      "note": "string",
      "paid": "boolean"
    }
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
  "total": "number",
  // optional
  "debt": {
    "total": "number",
    "note": "string",
    "paid": "boolean" //default false
  }
}
```

Response Body Success:

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "total": "number",
    "created_at": "string",
    // optional
    "debt": {
      "total": "number",
      "note": "string",
      "paid": "boolean"
    }
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

Query :

- Search = with transaction name & category
- Type = Sale Or Expense, if null get both transaction
- Time = transaction beetwen time, default today

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
        "receivable": {
          "total": "number",
          "note": "string",
          "paid": "boolean"
        }, // Or Null
        "created_at": "timestamp"
      },
      {
        "id": "number",
        "jenis": "string",
        "total": "number",
        "type": "pengeluaran",
        "debt": {
          "total": "number",
          "note": "string",
          "paid": "boolean"
        }, // Or Null
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

## Get transaction

Endpoint : Get /transaction/:type/:id

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
