import supertest from "supertest";
import { createTestCategory } from "./utils/category-test-utils";
import { addUser, getLoginToken, removeUser } from "./utils/user-test-utils";
import web from "../src/app/web";
import {
  cleanProduct,
  createTestProduct,
  generateTestProduct,
  getTestProduct,
} from "./utils/product-test-utils";

let access_token: string;
let idCategory: number;
describe("GET /api/product/list", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    await generateTestProduct(access_token);
  });
  afterEach(async () => {
    await cleanProduct();
    await removeUser();
  });

  test("should can get product with query params", async () => {
    const res = await supertest(web)
      .get("/api/product/list")
      .set("Authorization", "Bearer " + access_token)
      .query({ filter: ["pulsa"], search: "product test 10" });
    console.log(res.body.data);
    res.body.data.forEach((data) => {
      expect(data.category.name).toBe("pulsa");
    });
    expect(res.body.data.length).toBe(1);
  });

  test("should can get product without query params", async () => {
    const res = await supertest(web)
      .get("/api/product/list")
      .set("Authorization", "Bearer " + access_token);
    console.log(res.body.data);
    expect(res.body.data.length).toBe(10);
  });

  it("should can get product with query params search", async () => {
    const res = await supertest(web)
      .get("/api/product/list")
      .set("Authorization", "Bearer " + access_token)
      .query({ search: "product test 1" });
    expect(res.body.data.length).toBe(2);
  });
});

describe("POST /api/product", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    idCategory = await createTestCategory(access_token);
  });
  afterEach(async () => {
    await cleanProduct();
    await removeUser();
  });

  test("should can create product", async () => {
    const res = await supertest(web)
      .post("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "product test",
        category_id: idCategory,
        stock: 10,
        basic_price: 10000,
        selling_price: 12000,
      });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("product test");
    expect(res.body.data.category.name).toBe("test");
    expect(res.body.data.stock).toBe(10);
    expect(res.body.data.basic_price).toBe(10000);
    expect(res.body.data.selling_price).toBe(12000);
  });

  test("should reject create product with invalid product category", async () => {
    const res = await supertest(web)
      .post("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "product test",
        category_id: idCategory + 1,
        stock: 10,
        basic_price: 10000,
        selling_price: 12000,
      });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Category not found");
  });

  test("should reject create product with invalid product category", async () => {
    const res = await supertest(web)
      .post("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "product test",
        category_id: idCategory,
        stock: -10,
        basic_price: -10000,
        selling_price: -12000,
      });
    console.log(res.body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

let product_id: number;
describe("PATCH /api/product/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    idCategory = await createTestCategory(access_token);
    product_id = await createTestProduct(access_token, idCategory);
  });
  afterEach(async () => {
    await cleanProduct();
    await removeUser();
  });
  it("should can update product", async () => {
    const res = await supertest(web)
      .patch("/api/product/" + product_id)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "update test" });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("update test");
  });

  it("should reject update product with invalid product id", async () => {
    const res = await supertest(web)
      .patch("/api/product/" + product_id + 1)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "update test" });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");
  });

  it("should reject update product with invalid category id", async () => {
    const res = await supertest(web)
      .patch("/api/product/" + product_id)
      .set("Authorization", "Bearer " + access_token)
      .send({ name: "update test", category_id: idCategory + 1 });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Category not found");
  });

  it("should reject update product with invalid stock, basic price & selling price", async () => {
    const res = await supertest(web)
      .patch("/api/product/" + product_id)
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "update test",
        stock: -10,
        basic_price: -10000,
        selling_price: -12000,
      });
    console.log(res.body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

describe("GET /api/product/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    idCategory = await createTestCategory(access_token);
    product_id = await createTestProduct(access_token, idCategory);
  });
  afterEach(async () => {
    await cleanProduct();
    await removeUser();
  });

  it("should can get product", async () => {
    const res = await supertest(web)
      .get("/api/product/" + product_id)
      .set("authorization", "Bearer " + access_token);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("test");
  });

  it("should reject get product with invalid product id", async () => {
    const res = await supertest(web)
      .get("/api/product/" + product_id + 1)
      .set("authorization", "Bearer " + access_token);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");
  });
});

describe("DELETE /api/product/:id", () => {
  beforeEach(async () => {
    await addUser();
    access_token = await getLoginToken();
    idCategory = await createTestCategory(access_token);
    product_id = await createTestProduct(access_token, idCategory);
  });
  afterEach(async () => {
    await cleanProduct();
    await removeUser();
  });

  it("should can remove product", async () => {
    const product = await getTestProduct();
    const res = await supertest(web)
      .delete("/api/product/" + product_id)
      .set("authorization", "Bearer " + access_token);
    const productRemove = await getTestProduct();
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(product!.id);
    expect(productRemove).toBeNull();
  });

  it("should rejeect remove product with invalid product id", async () => {
    const product = await getTestProduct();
    const res = await supertest(web)
      .delete("/api/product/" + product_id + 1)
      .set("authorization", "Bearer " + access_token);
    const productRemove = await getTestProduct();
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");
    expect(productRemove).toEqual(product);
  });
});
