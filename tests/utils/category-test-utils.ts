import supertest from "supertest";
import { db } from "../../src/app/db";
import web from "../../src/app/web";

export const removeTestCategory = async (name: string = "test") => {
  await db.category.deleteMany({
    where: {
      name: {
        contains: "test",
      },
    },
  });
};

export const getTestCategory = async () => {
  return db.category.findMany({
    where: {
      name: "test",
    },
    select: {
      id: true,
      name: true,
    },
  });
};

export const createTestCategory = async (
  access_token: string,
  name: string = "test"
) => {
  const res = await supertest(web)
    .post("/api/category")
    .set("Authorization", "Bearer " + access_token)
    .send({ name });

  return res;
};
