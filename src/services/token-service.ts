import { Request } from "express";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";
import { tokenValidation } from "../validation/tokenValidatio";
import { validate } from "../validation/validation";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../helper/auth-helper";

const createAccessToken = async (req: Request<{}, {}, { token: string }>) => {
  const refresh_token = validate(tokenValidation, req.body.token);
  const verify = await db.user.findFirst({
    where: {
      token: refresh_token,
    },
    select: {
      email: true,
    },
  });
  if (!verify) throw new ResponseError(403, "Forbidden");
  return jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRETKEY as string,
    (err, user: any) => {
      if (err) throw new ResponseError(403, "Forbidden");
      if (user.email != verify.email) throw new ResponseError(403, "Forbidden");
      return generateAccessToken(user.id, user.username, user.email);
    }
  );
};
export default { createAccessToken };
