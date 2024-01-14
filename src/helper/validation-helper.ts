import days from "../app/time";
import { ResponseError } from "../errors/response-error";

export const isDateInvalid = (dates: Date[]) => {
  dates.forEach((date) => {
    if (!days(date, "DD-MM-YYY").isValid())
      throw new ResponseError(422, "query parameter time is invalid");
  });
};
