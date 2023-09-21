import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../errors/response-error";
import jwt from "jsonwebtoken";
import { User } from "../../interfaces/User";

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

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRETKEY as string,
    (err, user) => {
      if (err) throw new ResponseError(403, "Forbidden");
      req.user = user as User;
      next();
    }
  );
};
