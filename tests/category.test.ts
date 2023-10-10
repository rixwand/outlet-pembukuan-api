import supertest from "supertest";
import {
  createTestCategory,
  getTestCategory,
  removeTestCategory,
} from "./utils/category-test-utils";
import web from "../src/app/web";
import { addUser, getLoginToken, removeUser } from "./utils/user-test-utils";

let access_token: string;

describe("POST /api/category", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeUser();
  });

  it("should create category", async () => {
    const res = await supertest(web)
      .post("/api/category")
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "test" });
    const [category] = await getTestCategory();
    console.log(res.body);
    expect(res.body.data).toEqual(category);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("test");
  });

  it("should reject create category is already exist", async () => {
    await supertest(web)
      .post("/api/category")
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "test" });
    const res = await supertest(web)
      .post("/api/category")
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "test" });
    const category = await getTestCategory();
    console.log(res.body, category);
    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
  });
  it("should reject create empty category", async () => {
    const res = await supertest(web)
      .post("/api/category")
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "" });
    const category = await getTestCategory();
    console.log(res.body, category);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

let idCategory: number;
describe("PUT /api/category/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    idCategory = await createTestCategory(access_token);
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeUser();
  });

  it("should can update category", async () => {
    const res = await supertest(web)
      .put("/api/category/" + idCategory)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "notTest" });
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("notTest");
    await removeTestCategory("notTest");
  });

  it("should reject update category already exist", async () => {
    await supertest(web)
      .post("/api/category")
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "notTest" });
    const res = await supertest(web)
      .put("/api/category/" + idCategory)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "notTest" });
    console.log(res.body);
    expect(res.status).toBe(409);
    expect(res.body.error).toBeDefined();
    await removeTestCategory("notTest");
  });
});

describe("DELETE /api/category/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    idCategory = await createTestCategory(access_token);
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeUser();
  });

  it("should can delete category", async () => {
    const res = await supertest(web)
      .delete("/api/category/" + idCategory)
      .set("Authorization", "Bearer " + access_token);
    const categeory = await getTestCategory();
    console.log(categeory);
    expect(res.status).toBe(200);
    expect(res.body.data).toBe(idCategory);
  });

  it("should reject delete category doesn't exist", async () => {
    const res = await supertest(web)
      .delete("/api/category/" + idCategory + 1)
      .set("Authorization", "Bearer " + access_token);
    const categeory = await getTestCategory();
    console.log(categeory);
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

describe("GET /api/category", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
  });
  afterEach(async () => {
    await removeTestCategory();
    await removeUser();
  });
  it("should get all list category", async () => {
    for (let i = 0; i < 10; i++) {
      await createTestCategory(access_token, "test " + i);
    }
    const res = await supertest(web)
      .get("/api/category/list")
      .set("Authorization", "Bearer " + access_token);
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(10);
  });
});
