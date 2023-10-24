import supertest from "supertest";
import {
  createDebtTest,
  generateDebtTest,
  removeDebtTest,
} from "./utils/debt-test-utils";
import { addUser, getLoginToken, removeUser } from "./utils/user-test-utils";
import web from "../src/app/web";
import {
  createExpenseTestWithDebt,
  createExpenseTestWithoutDebt,
  removeTransactionExpenseTest,
} from "./utils/transaction-utils-test";

let debt_id: number, access_token: string;
describe("POST /api/debt", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
  });
  afterEach(async () => {
    await removeDebtTest();
    await removeTransactionExpenseTest();
    await removeUser();
  });

  it("should can create debt without expense", async () => {
    const res = await supertest(web)
      .post("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "test",
        total: 12000,
        paid: false,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.note).toBe("test");
    expect(res.body.data.total).toBe(12000);
    expect(res.body.data.paid).toBe(false);
  });

  it("should can create debt with expense", async () => {
    const expense_id = await createExpenseTestWithoutDebt(access_token);
    const res = await supertest(web)
      .post("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "test",
        total: 12000,
        paid: false,
        expense_id,
      });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.note).toBe("test");
    expect(res.body.data.total).toBe(12000);
    expect(res.body.data.paid).toBe(false);
    expect(res.body.data.expense.name).toBe("test");
  });

  it("should reject create debt with expense already has debt", async () => {
    const expense_id = await createExpenseTestWithDebt(access_token);
    const res = await supertest(web)
      .post("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "test",
        total: 12000,
        paid: false,
        expense_id,
      });
    console.log(res.body);
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Expense already has debt");
  });

  it("should reject create debt with invalid expense id", async () => {
    const res = await supertest(web)
      .post("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "test",
        total: 12000,
        paid: false,
        expense_id: 1,
      });
    console.log(res.body);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Transaction not found");
  });
});

describe("GET /api/debt/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    debt_id = await createDebtTest(access_token);
  });
  afterEach(async () => {
    await removeDebtTest();
    await removeTransactionExpenseTest();
    await removeUser();
  });

  it("should can get debt", async () => {
    const res = await supertest(web)
      .get("/api/debt/" + debt_id)
      .set("Authorization", "Bearer " + access_token);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(debt_id);
  });

  it("should reject get debt with invalid debt id", async () => {
    const res = await supertest(web)
      .get("/api/debt/" + debt_id + 1)
      .set("Authorization", "Bearer " + access_token);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Debt not found");
  });
});

describe("PATCH /api/debt/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    debt_id = await createDebtTest(access_token);
  });
  afterEach(async () => {
    await removeDebtTest();
    await removeTransactionExpenseTest();
    await removeUser();
  });

  it("should can update debt", async () => {
    const res = await supertest(web)
      .patch("/api/debt/" + debt_id)
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "not test",
        total: 25000,
        paid: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.note).toBe("not test");
    expect(res.body.data.total).toBe(25000);
    expect(res.body.data.paid).toBe(true);
  });

  it("should rejet update debt with invalid debt id", async () => {
    const res = await supertest(web)
      .patch("/api/debt/" + debt_id + 1)
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "not test",
        total: 25000,
        paid: true,
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Debt not found");
  });
});

describe("DELETE /api/debt/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    debt_id = await createDebtTest(access_token);
  });
  afterEach(async () => {
    await removeDebtTest();
    await removeTransactionExpenseTest();
    await removeUser();
  });

  it("should can update debt", async () => {
    const res = await supertest(web)
      .delete("/api/debt/" + debt_id)
      .set("Authorization", "Bearer " + access_token);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(debt_id);
  });

  it("should rejet update debt with invalid debt id", async () => {
    const res = await supertest(web)
      .delete("/api/debt/" + debt_id + 1)
      .set("Authorization", "Bearer " + access_token);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Debt not found");
  });
});

describe("GET /api/debt?filter", () => {
  beforeAll(async () => {
    await addUser();
    access_token = await getLoginToken();
    await generateDebtTest(access_token);
  });
  afterAll(async () => {
    await removeDebtTest();
    await removeUser();
  });

  it("should can get all debt", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(10);
  });

  it("should can get debt between time", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: ["10-1-2023", "10-5-2023"],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  it("should can get debt with between time with paid true", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: ["10-1-2023", "10-5-2023"],
        paid: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get debt with between time with paid false", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: ["10-1-2023", "10-5-2023"],
        paid: false,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should can get debt with paid false", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        paid: false,
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  it("should can get debt with paid true", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        paid: true,
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  it("should can get debt with search", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        search: "test 1",
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it("should get 0 debt with invalid search", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        search: "test 20",
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it("should get 0 debt with valid time but invalid search", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: ["10-1-2023", "10-5-2023"],
        search: "not test",
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});
