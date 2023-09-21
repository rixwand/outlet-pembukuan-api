import { ErrorRequestHandler } from "express";
import { ResponseError } from "../errors/response-error";
export const errorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
): void => {
  if (!err) {
    next();
    return;
  }
  if (err instanceof ResponseError) {
    res.status(err.status).json({ error: err.message }).end();
  } else {
    res.status(500).json({ error: err.message });
  }
};
