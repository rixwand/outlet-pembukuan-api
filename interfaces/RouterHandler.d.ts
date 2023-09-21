import { NextFunction, Request, Response } from "express";

export type RouterHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;
