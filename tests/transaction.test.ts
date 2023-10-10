import supertest from "supertest";
import web from "../src/app/web";
import { addUser, getLoginToken, removeUser } from "./utils/user-test-utils";
import {
  createExpenseTransactionTest,
  createSaleTransactionTest,
  generateTransactionTest,
  getSaleTransactionTest,
  removeTransactionExpenseTest,
  removeTransactionSaleTest,
} from "./utils/transaction-utils-test";
let saleId: number;
let expenseId: number;
let access_token: string;

// describe("POST /api/transaction/sale", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//   });
//   afterEach(async () => {
//     await removeTransactionSaleTest();
//     await removeUser();
//   });
//   it("should can create sale transaction", async () => {
//     const res = await supertest(web)
//       .post("/api/transaction/sale")
//       .set("Authorization", "Bearer " + access_token)
//       .send({
//         name: "product test",
//         category: "test",
//         basic_price: 10000,
//         selling_price: 12000,
//       });
//     expect(res.status).toBe(200);
//     expect(res.body.data.name).toBe("product test");
//     expect(res.body.data.category).toBe("test");
//     expect(res.body.data.receivable).toBeFalsy();
//     expect(res.body.data.basic_price).toBe(10000);
//     expect(res.body.data.selling_price).toBe(12000);
//   });

//   it("should reject sale transaction with invalid token", async () => {
//     const res = await supertest(web)
//       .post("/api/transaction/sale")
//       .set("Authorization", "Bearer " + "access_token")
//       .send({
//         name: "product test",
//         category: "test",
//         receivable: false,
//         basic_price: 10000,
//         selling_price: 12000,
//       });
//     expect(res.status).toBe(401);
//     expect(res.body.error).toBeDefined();
//   });
// });

// describe("POST /api/transaction/expense", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//   });
//   afterEach(async () => {
//     await removeTransactionExpenseTest();
//     await removeUser();
//   });

//   it("should can create expense transaction", async () => {
//     const res = await supertest(web)
//       .post("/api/transaction/expense")
//       .set("Authorization", "Bearer " + access_token)
//       .send({
//         name: "test",
//         total: 20000,
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBeDefined();
//     expect(res.body.data.name).toBe("test");
//     expect(res.body.data.total).toBe(20000);
//     expect(res.body.data.type).toBe("expense");
//   });

//   it("should can create expense transaction", async () => {
//     const res = await supertest(web)
//       .post("/api/transaction/expense")
//       .set("Authorization", "Bearer " + access_token)
//       .send({
//         name: "test",
//         total: 20000,
//         debt: true,
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBeDefined();
//     expect(res.body.data.name).toBe("test");
//     expect(res.body.data.total).toBe(20000);
//     expect(res.body.data.debt).toBeTruthy();
//     expect(res.body.data.type).toBe("expense");
//   });

//   it("should reject create expense transaction with invalid token", async () => {
//     const res = await supertest(web)
//       .post("/api/transaction/expense")
//       .set("Authorization", "Bearer " + "access_token")
//       .send({
//         name: "test",
//         total: 20000,
//         debt: true,
//       });

//     expect(res.status).toBe(401);
//     expect(res.body.error).toBeDefined();
//   });
// });

// describe("GET /api/transaction/sale/:id", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//     saleId = await createSaleTransactionTest(access_token);
//   });
//   afterEach(async () => {
//     await removeTransactionSaleTest();
//     await removeUser();
//   });

//   it("should can get sales", async () => {
//     const res = await supertest(web)
//       .get("/api/transaction/sale/" + saleId)
//       .set("Authorization", "Bearer " + access_token);

//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(saleId);
//     expect(res.body.data.name).toBe("product test");
//     expect(res.body.data.category).toBe("test");
//     expect(res.body.data.basic_price).toBe(10000);
//     expect(res.body.data.selling_price).toBe(12000);
//   });

//   it("should reject get sales with invalid sale id", async () => {
//     const res = await supertest(web)
//       .get("/api/transaction/sale/" + saleId + 1)
//       .set("Authorization", "Bearer " + access_token);

//     expect(res.status).toBe(404);
//     expect(res.body.error).toBe("Transaction not found");
//   });
// });

// describe("PATCH /api/transaction/sale/:id", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//     saleId = await createSaleTransactionTest(access_token);
//   });
//   afterEach(async () => {
//     await removeTransactionSaleTest();
//     await removeUser();
//   });

//   it("should can update sales", async () => {
//     const res = await supertest(web)
//       .patch("/api/transaction/sale/" + saleId)
//       .set("Authorization", "Bearer " + access_token)
//       .send({
//         name: "not test",
//         category: "another test",
//         basic_price: 20000,
//         selling_price: 22000,
//       });

//     const updatedSale = await getSaleTransactionTest(access_token, saleId);
//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(saleId);
//     expect(res.body.data.name).toBe("not test");
//     expect(res.body.data.category).toBe("another test");
//     expect(res.body.data.basic_price).toBe(20000);
//     expect(res.body.data.selling_price).toBe(22000);
//     expect(res.body.data.receivable).toBeTruthy();
//     console.log(res.body.data);
//     console.log(updatedSale);
//     expect(res.body.data).toEqual(updatedSale);
//   });

//   it("should reject update sales with invalid sale id", async () => {
//     const res = await supertest(web)
//       .patch("/api/transaction/sale/" + saleId + 1)
//       .set("Authorization", "Bearer " + access_token);

//     expect(res.status).toBe(404);
//     expect(res.body.error).toBe("Transaction not found");
//   });
// });

// describe("DELETE /api/transaction/sale/:id", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//     saleId = await createSaleTransactionTest(access_token);
//   });
//   afterEach(async () => {
//     await removeTransactionSaleTest();
//     await removeUser();
//   });

//   it("should can delete sales", async () => {
//     const res = await supertest(web)
//       .delete("/api/transaction/sale/" + saleId)
//       .set("Authorization", "Bearer " + access_token);

//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(saleId);
//   });

//   it("should reject delete sales with invalid sale id", async () => {
//     const res = await supertest(web)
//       .delete("/api/transaction/sale/" + saleId + 1)
//       .set("Authorization", "Bearer " + access_token);

//     expect(res.status).toBe(404);
//     expect(res.body.error).toBe("Transaction not found");
//   });
// });

// describe("GET /api/transaction/expense/:id", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//     expenseId = await createExpenseTransactionTest(access_token);
//   });
//   afterEach(async () => {
//     await removeTransactionExpenseTest();
//     await removeUser();
//   });

//   it("should can get expense", async () => {
//     const res = await supertest(web)
//       .get("/api/transaction/expense/" + expenseId)
//       .set("Authorization", "Bearer " + access_token);
//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(expenseId);
//     expect(res.body.data.name).toBe("test");
//     expect(res.body.data.total).toBe(20000);
//     expect(res.body.data.debt).toBeTruthy();
//   });

//   it("should reject get expense with invalid expense id", async () => {
//     const res = await supertest(web)
//       .get("/api/transaction/expense/" + expenseId + 1)
//       .set("Authorization", "Bearer " + access_token);
//     expect(res.status).toBe(404);
//     expect(res.body.error).toBe("Transaction not found");
//   });
// });

// describe("PATCH /api/transaction/expense/:id", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//     expenseId = await createExpenseTransactionTest(access_token);
//   });
//   afterEach(async () => {
//     await removeTransactionExpenseTest();
//     await removeUser();
//   });

//   it("should can update expense", async () => {
//     const res = await supertest(web)
//       .patch("/api/transaction/expense/" + expenseId)
//       .set("Authorization", "Bearer " + access_token)
//       .send({
//         name: "not test",
//         total: 10000,
//         debt: false,
//       });
//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(expenseId);
//     expect(res.body.data.name).toBe("not test");
//     expect(res.body.data.total).toBe(10000);
//     expect(res.body.data.debt).toBeFalsy();
//   });

//   it("should reject update expense with invalid expense id", async () => {
//     const res = await supertest(web)
//       .patch("/api/transaction/expense/" + expenseId + 1)
//       .set("Authorization", "Bearer " + access_token);
//     expect(res.status).toBe(404);
//     expect(res.body.error).toBe("Transaction not found");
//   });
// });
// describe("DELETE /api/transaction/expense/:id", () => {
//   beforeEach(async () => {
//     await addUser();
//     access_token = await getLoginToken();
//     expenseId = await createExpenseTransactionTest(access_token);
//   });
//   afterEach(async () => {
//     await removeTransactionExpenseTest();
//     await removeUser();
//   });

//   it("should can delete expense", async () => {
//     const res = await supertest(web)
//       .delete("/api/transaction/expense/" + expenseId)
//       .set("Authorization", "Bearer " + access_token);
//     expect(res.status).toBe(200);
//     expect(res.body.data.id).toBe(expenseId);
//   });

//   it("should reject delete expense with invalid expense id", async () => {
//     const res = await supertest(web)
//       .delete("/api/transaction/expense/" + expenseId + 1)
//       .set("Authorization", "Bearer " + access_token);
//     expect(res.status).toBe(404);
//     expect(res.body.error).toBe("Transaction not found");
//   });
// });

describe("GET /api/transaction?filter", () => {
  beforeAll(async () => {
    await addUser();
    access_token = await getLoginToken();
    await generateTransactionTest(access_token);
  });
  afterAll(async () => {
    await removeTransactionExpenseTest();
    await removeTransactionSaleTest();
    await removeUser();
  });

  it("should can get all list transaction between time", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({ time: [new Date("10-08-2023"), new Date("10-11-2023")] });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(6);
  });

  it("should can get sale list transaction between time", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-08-2023"), new Date("10-11-2023")],
        type: "sale",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get expense list transaction between time", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-08-2023"), new Date("10-11-2023")],
        type: "expense",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get all list transaction between time with debt and receivable true", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-08-2023"), new Date("10-11-2023")],
        debt: true,
        receivable: true,
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(4);
  });

  it("should can get all list transaction between time with debt and receivable false", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-08-2023"), new Date("10-11-2023")],
        debt: false,
        receivable: false,
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should can get all sale transaction between time with receivable true", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-01-2023"), new Date("10-11-2023")],
        receivable: true,
        type: "sale",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  it("should can get all sale transaction between time with receivable true", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-01-2023"), new Date("10-11-2023")],
        debt: true,
        type: "expense",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get all sale transaction between time with search", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-01-2023"), new Date("10-11-2023")],
        search: "test 1",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get all transaction between time with category  search", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-01-2023"), new Date("10-11-2023")],
        search: "kartu",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    res.body.data.forEach((sale: { category: string }) => {
      expect(sale.category).toBe("Kartu");
    });
  });

  it("should can get all transaction between time with expense search", async () => {
    const res = await supertest(web)
      .get("/api/transaction")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [new Date("10-01-2023"), new Date("10-11-2023")],
        search: "expense test 1",
      });
    console.log(res.body.error, res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});
