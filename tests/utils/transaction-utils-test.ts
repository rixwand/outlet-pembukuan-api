import supertest from "supertest";
import { db } from "../../src/app/db";
import web from "../../src/app/web";
import { randomInt } from "./product-test-utils";

export const removeTransactionSaleTest = async (name: string = "test") => {
  await db.sale.deleteMany({
    where: { name: { contains: name } },
  });
};

export const removeTransactionExpenseTest = async (name: string = "test") => {
  await db.expense.deleteMany({
    where: { name: { contains: name } },
  });
};

export const createSaleTransactionTest = async (
  access_token: string,
  name: string = "test"
) => {
  const res = await supertest(web)
    .post("/api/transaction/sale")
    .set("Authorization", "Bearer " + access_token)
    .send({
      name: "product " + name,
      category: "test",
      basic_price: 10000,
      selling_price: 12000,
      receivable: true,
    });
  return res.body.data.id;
};

export const createExpenseTransactionTest = async (
  access_token: string,
  name: string = "test"
) => {
  const res = await supertest(web)
    .post("/api/transaction/expense")
    .set("Authorization", "Bearer " + access_token)
    .send({
      name,
      total: 20000,
      debt: true,
    });
  return res.body.data.id;
};

export const getSaleTransactionTest = async (
  access_token: string,
  saleId: number
) => {
  const res = await supertest(web)
    .get("/api/transaction/sale/" + saleId)
    .set("Authorization", "Bearer " + access_token);
  return res.body.data;
};

export const getExpenseTransactionTest = async (
  access_token: string,
  expenseId: number
) => {
  const res = await supertest(web)
    .get("/api/transaction/expense/" + expenseId)
    .set("Authorization", "Bearer " + access_token);
  return res.body.data;
};

export const generateTransactionTest = async (access_token: string) => {
  const date = new Date();
  for (let i = 1; i <= 10; i++) {
    let category: string;
    const rand = randomInt(1, 3);
    switch (rand) {
      case 1:
        category = "Pulsa";
        break;
      case 2:
        category = "Voucher";
        break;
      default:
        category = "Kartu";
        break;
    }
    await supertest(web)
      .post("/api/transaction/sale")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "sale test " + i,
        category,
        basic_price: randomInt(10000, 15000),
        selling_price: randomInt(15000, 20000),
        receivable: i % 2 == 0 ? true : false,
        created_at: new Date(date.setDate(i)),
      });
  }

  for (let i = 6; i <= 10; i++) {
    await supertest(web)
      .post("/api/transaction/expense")
      .set("Authorization", "Bearer " + access_token)
      .send({
        name: "expense test " + i,
        total: randomInt(15000, 20000),
        debt: i % 2 == 0 ? true : false,
        created_at: new Date(date.setDate(i)),
      });
  }
};
