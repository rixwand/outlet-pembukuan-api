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
import days from "../src/app/time";

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
  const curr = new Date(); // get current date
  const first = curr.getDate() - curr.getDay() + 1;
  beforeAll(async () => {
    await addUser();
    access_token = await getLoginToken();
    await generateDebtTest(access_token);
  });
  afterAll(async () => {
    await removeDebtTest();
    await removeUser();
  });

  it("should can get debt in a week", async () => {
    const res = await supertest(web)
      .get("/api/debt")
      // .query({ time: ["06-01-2024", "14-01-2024"] })
      .set("Authorization", "Bearer " + access_token);
    console.log(res.body.error);
    expect(res.status).toBe(200);
    const datas = res.body.data.map((data) => ({
      ...data,
      created_at: days(data.created_at).format("ddd DD-MM-YYYY hh:mm:ss"),
    }));
    console.log(datas);
    expect(res.body.data.length).toBe(7);
  });

  it("should can get debt between time", async () => {
    const firstday = days().startOf("week");
    const start = firstday
      .set("date", firstday.get("date") + 2)
      .format("DD-MM-YYYY");
    const end = days().endOf("week").format("DD-MM-YYYY");
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [start, end],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  it("should can get debt with between time with paid true", async () => {
    const firstday = days().startOf("week");
    const start = firstday.format("DD-MM-YYYY");
    const end = firstday
      .set("date", firstday.get("date") + 4)
      .format("DD-MM-YYYY");
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [start, end],
        paid: true,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get debt with between time with paid false", async () => {
    const firstday = days().startOf("week");
    const start = firstday.format("DD-MM-YYYY");
    const end = firstday
      .set("date", firstday.get("date") + 4)
      .format("DD-MM-YYYY");
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [start, end],
        paid: false,
      });
    expect(res.status).toBe(200);
    const datas = res.body.data.map((data) => ({
      ...data,
      created_at: days(data.created_at).format("ddd DD-MM-YYYY hh:mm:ss"),
    }));
    console.log(datas);
    expect(res.body.data.length).toBe(2);
  });

  it("should can get debt with paid false", async () => {
    const firstday = days().startOf("week");
    const start = firstday.format("DD-MM-YYYY");
    const end = firstday
      .set("date", firstday.get("date") + 9)
      .format("DD-MM-YYYY");
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [start, end],
        paid: false,
      });
    const datas = res.body.data.map((data) => ({
      ...data,
      created_at: days(data.created_at).format("ddd DD-MM-YYYY hh:mm:ss"),
    }));
    console.log(datas);
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
    expect(res.body.data.length).toBe(4);
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
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it("should get 0 debt with valid time but invalid search", async () => {
    const firstday = days().startOf("week");
    const start = firstday.format("DD-MM-YYYY");
    const end = firstday
      .set("date", firstday.get("date") + 4)
      .format("DD-MM-YYYY");
    const res = await supertest(web)
      .get("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [start, end],
        search: "not test",
      });
    console.log(res.error);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});
