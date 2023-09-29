import Joi from "joi";

export const createSaleValidation = Joi.object({
  name: Joi.string().required().max(100),
  category: Joi.string().required().max(100),
  baisc_price: Joi.number().integer().positive().required(),
  selling_price: Joi.number().integer().positive().required(),
  receivable: Joi.boolean().required().default(false),
});

export const updateSaleValidation = Joi.object({
  name: Joi.string().optional().max(100),
  category: Joi.string().optional().max(100),
  baisc_price: Joi.number().integer().positive().optional(),
  selling_price: Joi.number().integer().positive().optional(),
  receivable: Joi.boolean().optional().default(false),
});

export const createExpenseValidation = Joi.object({
  name: Joi.string().required().max(100),
  total: Joi.number().integer().positive().required(),
});

export const updateExpenseValidation = Joi.object({
  name: Joi.string().optional().max(100),
  total: Joi.number().integer().positive().optional(),
});

export const listTransactionValdiation = Joi.object({
  search: Joi.string().optional().max(100),
  type: Joi.string().optional().max(100),
  time: Joi.array().items(Joi.string().required().max(100)).has(2),
});
