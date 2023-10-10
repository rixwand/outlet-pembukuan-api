import { UserLogin, User } from "../../interfaces/User.d";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";
import { generateAccessToken } from "../helper/auth-helper";
import {
  getUserValidation,
  loginValidation,
  registerValidation,
  updateValidation,
} from "../validation/user-validation";
import { validate } from "../validation/validation";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

type dataUpdate = {
  username?: string;
  passwordUpdate?: { oldPassword: string; newPassword: string };
  email?: string;
  password?: string;
};

const register = async (
  requset: Request
): Promise<{ username: string; email: string }> => {
  const user: UserLogin = validate(
    registerValidation,
    requset.body!
  ) as UserLogin;

  const count: number = await db.user.count({
    where: {
      email: user.email,
    },
  });

  if (count === 1) throw new ResponseError(400, "email already registered");

  user.password = await bcrypt.hash(user.password, 10);
  return db.user.create({
    data: user,
    select: {
      username: true,
      email: true,
    },
  });
};
type loginField = {
  email: string;
  password: string;
};
const login = async (
  req: Request
): Promise<{ access_token: string; refresh_token: string }> => {
  const userLogin: loginField = validate(
    loginValidation,
    req.body
  ) as loginField;

  const user = await db.user.findUnique({
    where: {
      email: userLogin.email,
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });
  if (!user) throw new ResponseError(401, "wrong email or password");
  const isValid = await bcrypt.compare(userLogin.password, user.password);
  if (!isValid) throw new ResponseError(401, "wrong email or password");

  const access_token = generateAccessToken(user.id, user.username, user.email);
  const refresh_token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.REFRESH_TOKEN_SECRETKEY as string
  );

  await db.user.update({
    data: {
      token: refresh_token,
    },
    where: {
      email: user.email,
    },
  });
  return { access_token, refresh_token };
};

const logout = async (req: Request): Promise<void> => {
  const user = req.user;
  await db.user.update({
    data: {
      token: null,
    },
    where: {
      email: user.email,
    },
  });
};

const get = async (email: string): Promise<User> => {
  email = validate(getUserValidation, email);
  const user = (await db.user.findUnique({
    where: {
      email,
    },
    select: {
      username: true,
      email: true,
    },
  })) as User;
  return user;
};

const update = async (userEmail: string, data: dataUpdate): Promise<User> => {
  let userUpdate = validate(updateValidation, data);

  const user = await db.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      password: true,
    },
  });
  if (!user) throw new ResponseError(401, "Unauthorized");
  if (userUpdate.passwordUpdate) {
    const { oldPassword, newPassword } = userUpdate.passwordUpdate;
    delete userUpdate.passwordUpdate;
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) throw new ResponseError(403, "wrong password");
    userUpdate.password = await bcrypt.hash(newPassword, 10);
  }
  const updated = await db.user.update({
    where: {
      email: userEmail,
    },
    data: {
      ...userUpdate,
    },
    select: {
      username: true,
      email: true,
    },
  });
  return updated;
};

export default { register, login, logout, get, update };
