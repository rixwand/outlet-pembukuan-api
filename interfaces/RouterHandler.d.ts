import { NextFunction, Request, Response } from "express";

export type RouterHandler<T, P = {}> = (
  req: Request<P>,
  res: Response,
  next: NextFunction
) => T;
