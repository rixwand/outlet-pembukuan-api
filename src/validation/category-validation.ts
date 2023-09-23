import joi from "joi";
export const categoryValidation = joi.object({
  name: joi.string().required().max(100),
});
