import supertest from "supertest";
import web from "../../src/app/web";
import { db } from "../../src/app/db";
import { randomInt } from "./product-test-utils";
import days from "../../src/app/time";

export const createReceivableTest = async (
  access_token: string,
  sale_id: number,
  note: string = "test"
) => {
  await supertest(web)
    .post("/api/receivable")
    .set("Authorization", "Bearer " + access_token)
    .send({
      sale_id,
      note,
      total: 12000,
      paid: false,
    });
};

export const createReceivableTestWithSale = async (
  access_token: string,
  name: string = "test"
) => {
  const res = await supertest(web)
    .post("/api/transaction/sale")
    .set("Authorization", "Bearer " + access_token)
    .send({
      name,
      category: "test",
      basic_price: 10000,
      selling_price: 15000,
      receivable: {
        note: "test",
        total: 15000,
        paid: false,
      },
    });
  const receivable = await db.receivable.findFirst({
    where: {
      note: "test",
      sale_id: res.body.data.id,
    },
    select: {
      id: true,
    },
  });

  return receivable?.id;
};

export const removeReceivableTest = async () => {
  await db.receivable.deleteMany({
    where: { note: { contains: "test" } },
  });
};

export const getReceivableTest = async (id: number) => {
  return db.receivable.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      note: true,
      total: true,
      sale: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const generateSaleReceivable = async (access_token: string) => {
  const firstday = days().startOf("week");
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
        receivable: {
          note: "test " + i,
          total: i * 10000,
          paid: i % 2 == 0 ? false : true,
        },
        created_at: firstday
          .set("date", firstday.get("date") + i - 1)
          .toISOString(),
      });
  }
};
