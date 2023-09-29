import { NextFunction, Request, Response } from "express";

export type RouterHandler<
  T,
  P = {},
  ResBody = {},
  ReqBody = {},
  ReqQuery = {}
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => T;

export type params = { id: number };
