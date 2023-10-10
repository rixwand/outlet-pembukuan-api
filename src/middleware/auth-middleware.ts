import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../errors/response-error";
import jwt from "jsonwebtoken";
import { User } from "../../interfaces/User";
import { db } from "../app/db";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) throw new ResponseError(401, "Unauthorized");
  const authType = authHeader?.split(" ")[0].toLowerCase();
  if (authType != "bearer") throw new ResponseError(401, "Unauthorized");

  try {
    const user: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRETKEY as string
    );
    db.user
      .findFirst({
        where: {
          email: user.email,
        },
        select: { token: true },
      })
      .then((result) => {
        if (!result?.token) {
          return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user as User & { id: number };
        next();
      })
      .catch((err) => {
        return res.status(403).json({ error: "Forbidden" });
      });
  } catch (error) {
    throw new ResponseError(401, "Unauthorized");
  }
};
