import joi from "joi";

export const createProductValidation = joi.object({
  name: joi.string().required().max(100),
  category_id: joi.number().required().positive().min(1).integer(),
  stock: joi.number().required().positive().integer(),
  basic_price: joi.number().required().positive().integer(),
  selling_price: joi.number().required().positive().integer(),
});
