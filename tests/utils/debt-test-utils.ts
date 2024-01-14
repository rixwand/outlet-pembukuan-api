import supertest from "supertest";
import web from "../../src/app/web";
import { db } from "../../src/app/db";
import days from "../../src/app/time";

export const createDebtTestWithExpense = async (
  access_token: string,
  expense_id: number,
  note: string = "test"
) => {
  const debt = await supertest(web)
    .post("/api/debt")
    .set("Authorization", "Bearer " + access_token)
    .send({
      expense_id,
      note,
      total: 20000,
      paid: false,
    });
  return debt.body.data.id;
};
export const createDebtTest = async (
  access_token: string,
  note: string = "test"
) => {
  const debt = await supertest(web)
    .post("/api/debt")
    .set("Authorization", "Bearer " + access_token)
    .send({
      note,
      total: 20000,
      paid: false,
    });
  return debt.body.data.id;
};

export const removeDebtTest = async () => {
  await db.debt.deleteMany({
    where: { note: { contains: "test" } },
  });
};

export const getDebtTest = async (id: number) => {
  return db.debt.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      note: true,
      total: true,
      expense: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const generateDebtTest = async (access_token: string) => {
  const firstday = days().startOf("week");
  for (let i = 1; i <= 10; i++) {
    await supertest(web)
      .post("/api/debt")
      .set("Authorization", "Bearer " + access_token)
      .send({
        note: "test " + i,
        total: i * 10000,
        paid: i % 2 == 0 ? false : true,
        created_at: firstday
          .set("date", firstday.get("date") + i - 1)
          .toISOString(),
      });
  }
};
