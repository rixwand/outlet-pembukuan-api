import supertest from "supertest";
import {
  createTestCategory,
  removeTestCategory,
} from "./utils/category-test-utils";
import { addUser, getLoginToken, removeUser } from "./utils/user-test-utils";
import web from "../src/app/web";
import { cleanProduct, generateTestProduct } from "./utils/product-test-utils";
import { skip } from "node:test";

let access_token: string;
let idCategory: number;
describe("GET /api/product", () => {
  beforeEach(async () => {
    await addUser();
    access_token = (await getLoginToken()).access_token;
    await generateTestProduct(access_token);
  });
  afterEach(async () => {
    await cleanProduct();
    await removeUser();
  });

  test.skip("should can get product with query params", async () => {
    const res = await supertest(web)
      .get("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .query({ filter: ["pulsa"], search: "product 10" });
    console.log(res.body.data);
    res.body.data.forEach((data) => {
      expect(data.category.name).toBe("pulsa");
    });
    expect(res.body.data.length).toBe(1);
  });

  test.skip("should can get product without query params", async () => {
    const res = await supertest(web)
      .get("/api/product")
      .set("Authorization", "Bearer " + access_token);
    console.log(res.body.data);
    expect(res.body.data.length).toBe(10);
  });

  it("should can get product with query params search", async () => {
    const res = await supertest(web)
      .get("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .query({ search: "product 1" });
    console.log(res.body.data);
    expect(res.body.data.length).toBe(2);
  });
});
