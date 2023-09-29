import { faker } from "@faker-js/faker";
import web from "../../src/app/web";
import { createTestCategory } from "./category-test-utils";
import supertest from "supertest";
import { db } from "../../src/app/db";
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export const generateRandomTestProduct = async (
  access_token: string,
  totalCategory: number,
  totalProduct: number
) => {
  let id: Array<number> = [];
  for (let i = 1; i <= totalCategory; i++) {
    let res = await createTestCategory(
      access_token,
      faker.commerce.productMaterial()
    );
    if (res.status == 409) {
      res = await createTestCategory(
        access_token,
        faker.commerce.productMaterial()
      );
    }
    id.push(res.body.data.id);
  }
  for (let i = 1; i <= totalProduct; i++) {
    await supertest(web)
      .post("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: faker.commerce.productName(),
        category_id: id[randomInt(0, id.length - 1)],
        stock: randomInt(5, 10),
        basic_price: randomInt(5000, 10000),
        selling_price: randomInt(10000, 15000),
      });
  }
};

export const generateTestProduct = async (access_token: string) => {
  const categories = ["pulsa", "kartu"];
  let id: Array<number> = [];
  for (let i = 0; i <= categories.length - 1; i++) {
    const res = await createTestCategory(access_token, categories[i]);
    id.push(res.body.data.id);
  }
  for (let i = 1; i <= 10; i++) {
    const res = await supertest(web)
      .post("/api/product")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "product " + i,
        category_id: id[i % 2 == 0 ? 0 : 1],
        stock: randomInt(5, 10),
        basic_price: randomInt(5000, 10000),
        selling_price: randomInt(10000, 15000),
      });
    if (res.body.error) {
      console.log("id : ", id);
      console.log(res.body.error, "product " + i, " ", id[i % 2 == 0 ? 0 : 1]);
    }
  }
};
export const cleanProduct = async () => {
  await db.$queryRaw`DELETE from products`;
  await db.$queryRaw`DELETE from categories`;
};
