import { ResponseError } from "../errors/response-error";

export const isDateInvalid = (dates: Date[]) => {
  dates.forEach((date) => {
    if (isNaN(new Date(date).getTime()))
      throw new ResponseError(422, "query parameter time is invalid");
  });
};
