import supertest from "supertest";
import { UserInfo, UserLogin } from "../../interfaces/User";
import { db } from "../../src/app/db";
import bcrypt from "bcrypt";
import web from "../../src/app/web";

export const removeUser = async (
  email: string = "test@gmail.com"
): Promise<void> => {
  await db.user.deleteMany({
    where: {
      email,
    },
  });
};

export const addUser = async (): Promise<void> => {
  await db.user.create({
    data: {
      username: "test",
      email: "test@gmail.com",
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

export const getLoginToken = async (): Promise<{
  access_token: string;
  refresh_token: string;
}> => {
  const res = await supertest(web).post("/api/user/login").send({
    email: "test@gmail.com",
    password: "test",
  });

  return res.body.data;
};

export const sleep = async (sec: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, sec * 1000);
  });
};
