import supertest from "supertest";
import {
  createReceivableTestWithSale,
  generateSaleReceivable,
  getReceivableTest,
  removeReceivableTest,
} from "./utils/receivable-test-utils";
import {
  createSaleTestWithoutReceivable,
  removeTransactionSaleTest,
} from "./utils/transaction-utils-test";
import { addUser, getLoginToken, removeUser } from "./utils/user-test-utils";
import web from "../src/app/web";
import days from "../src/app/time";

let access_token: string;
let receivable_id: number;

describe("POST /api/receivable", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
  });
  afterEach(async () => {
    await removeReceivableTest();
    await removeTransactionSaleTest();
    await removeUser();
  });

  it("should can create receivable", async () => {
    const sale_id = await createSaleTestWithoutReceivable(access_token);
    const res = await supertest(web)
      .post("/api/receivable")
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "test",
        total: 10000,
        paid: false,
        sale_id,
      });
    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body.data.note).toBe("test");
    expect(res.body.data.total).toBe(10000);
    expect(res.body.data.paid).toBe(false);
    expect(res.body.data.sale.name).toBe("product test");
  });
});

describe("PATCH /api/receivable/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    receivable_id = (await createReceivableTestWithSale(
      access_token
    )) as number;
  });
  afterEach(async () => {
    await removeReceivableTest();
    await removeTransactionSaleTest();
    await removeUser();
  });

  it("should can update receivable", async () => {
    const res = await supertest(web)
      .patch("/api/receivable/" + receivable_id)
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "not test",
        total: 12000,
        paid: true,
      });
    console.log(res.body, receivable_id);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(receivable_id);
    expect(res.body.data.total).toBe(12000);
    expect(res.body.data.note).toBe("not test");
    expect(res.body.data.paid).toBeTruthy();
  });

  it("should reject update receivable with invalid id", async () => {
    const res = await supertest(web)
      .patch("/api/receivable/" + receivable_id + 1)
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "not test",
        total: 12000,
        paid: true,
      });
    expect(res.status).toBe(404);
    expect(res.body?.error).toBe("Receivable not found");
  });
});

describe("DELETE /api/receivable/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    receivable_id = (await createReceivableTestWithSale(
      access_token
    )) as number;
  });
  afterEach(async () => {
    await removeReceivableTest();
    await removeTransactionSaleTest();
    await removeUser();
  });
  it("should can delete receivable", async () => {
    const res = await supertest(web)
      .delete("/api/receivable/" + receivable_id)
      .set("Authorization", "Bearer " + access_token);
    const receivable = await getReceivableTest(receivable_id);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(receivable_id);
    expect(receivable).toBeNull();
  });

  it("should reject delete receivable with invalid id", async () => {
    const res = await supertest(web)
      .delete("/api/receivable/" + receivable_id + 1)
      .set("Authorization", "Bearer " + access_token);
    const receivable = await getReceivableTest(receivable_id);

    expect(res.status).toBe(404);
    expect(res.body?.error).toBe("Receivable not found");
    expect(receivable).toBeDefined();
  });
});

describe("GET /api/receivable/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    receivable_id = (await createReceivableTestWithSale(
      access_token
    )) as number;
  });
  afterEach(async () => {
    await removeReceivableTest();
    await removeTransactionSaleTest();
    await removeUser();
  });

  it("should can get receivable", async () => {
    const res = await supertest(web)
      .get("/api/receivable/" + receivable_id)
      .set("Authorization", "Bearer " + access_token);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(receivable_id);
    expect(res.body.data.note).toBe("test");
    expect(res.body.data.total).toBe(15000);
    expect(res.body.data.paid).toBeFalsy();
  });

  it("should reject get receivable with invalid id", async () => {
    const res = await supertest(web)
      .get("/api/receivable/" + receivable_id + 1)
      .set("Authorization", "Bearer " + access_token);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Receivable not found");
  });

  it("should reject get receivable with invalid access token", async () => {
    const res = await supertest(web)
      .get("/api/receivable/" + receivable_id)
      .set("Authorization", "Bearer i" + access_token);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });
});

describe("GET /api/receivable?filter", () => {
  beforeAll(async () => {
    await addUser();
    access_token = await getLoginToken();
    await generateSaleReceivable(access_token);
  });
  afterAll(async () => {
    await removeReceivableTest();
    await removeTransactionSaleTest();
    await removeUser();
  });

  it("should can get receivable beetween time", async () => {
    const firstday = days().startOf("week");
    const end = firstday.set("date", firstday.get("date") + 4);
    const res = await supertest(web)
      .get("/api/receivable")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [firstday.format("DD-MM-YYYY"), end.format("DD-MM-YYYY")],
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
  });

  it("should can get receivable beetween time with paid true", async () => {
    const firstday = days().startOf("week");
    const end = firstday.set("date", firstday.get("date") + 4);
    const res = await supertest(web)
      .get("/api/receivable")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [firstday.format("DD-MM-YYYY"), end.format("DD-MM-YYYY")],
        paid: true,
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(3);
  });

  it("should can get receivable beetween time with paid false and search kartu", async () => {
    const firstday = days().startOf("week");
    const end = firstday.set("date", firstday.get("date") + 9);
    const res = await supertest(web)
      .get("/api/receivable")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [firstday.format("DD-MM-YYYY"), end.format("DD-MM-YYYY")],
        paid: false,
        search: "kartu",
      });
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).not.toBe(0);
    res.body.data.forEach((receivable) => {
      expect(receivable.sale.category).toBe("Kartu");
    });
  });

  it("should reject get receivable with search not found ", async () => {
    const firstday = days().startOf("week");
    const end = firstday.set("date", firstday.get("date") + 9);
    const res = await supertest(web)
      .get("/api/receivable")
      .set("Authorization", "Bearer " + access_token)
      .query({
        time: [firstday.format("DD-MM-YYYY"), end.format("DD-MM-YYYY")],
        search: "kategori",
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Receivable not found");
  });

  it("should can get all receivable in a week", async () => {
    const res = await supertest(web)
      .get("/api/receivable")
      .set("Authorization", "Bearer " + access_token);
    console.log(res.body.data);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(7);
  });
});
