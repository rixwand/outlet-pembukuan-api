import { Schema } from "../../node_modules/joi/lib/index";
import { ResponseError } from "../errors/response-error";
export const validate = <T>(schema: Schema, data: T): T => {
  const res = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (!res.error) {
    return res.value;
  } else {
    throw new ResponseError(400, res.error.message);
  }
};
