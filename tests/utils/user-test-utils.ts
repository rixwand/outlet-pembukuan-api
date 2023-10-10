import supertest from "supertest";
import { UserInfo, UserLogin } from "../../interfaces/User";
import { db } from "../../src/app/db";
import bcrypt from "bcrypt";
import web from "../../src/app/web";

export const removeUser = async (name: string = "test"): Promise<void> => {
  await db.user.deleteMany({
    where: {
      email: `${name}@gmail.com`,
    },
  });
};

export const addUser = async (name: string = "test"): Promise<void> => {
  await db.user.create({
    data: {
      username: name,
      email: `${name}@gmail.com`,
      password: await bcrypt.hash("test", 10),
    },
  });
};

export const getUser = async (): Promise<UserInfo & UserLogin> => {
  return (await db.user.findUnique({
    where: {
      email: "test@gmail.com",
    },
    select: {
      id: true,
      username: true,
      email: true,
      token: true,
      password: true,
    },
  })) as UserInfo & UserLogin;
};

export const getLoginToken = async (name: string = "test"): Promise<string> => {
  const res = await supertest(web)
    .post("/api/user/login")
    .send({
      email: `${name}@gmail.com`,
      password: "test",
    });

  return res.body.data.access_token;
};

export const sleep = async (sec: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};
