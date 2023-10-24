import Joi, { any } from "joi";

export const createSaleValidation = Joi.object({
  name: Joi.string().required().max(100),
  category: Joi.string().required().max(100),
  basic_price: Joi.number().integer().positive().required(),
  selling_price: Joi.number().integer().positive().required(),
  receivable: Joi.object({
    total: Joi.number().positive().integer().required(),
    note: Joi.string().max(300).required(),
    paid: Joi.boolean().required().default(false),
  })
    .optional()
    .allow(null),
  created_at: Joi.date().optional(),
});

export const updateSaleValidation = Joi.object({
  name: Joi.string().optional().max(100),
  category: Joi.string().optional().max(100),
  basic_price: Joi.number().integer().positive().optional(),
  selling_price: Joi.number().integer().positive().optional(),
});

export const createExpenseValidation = Joi.object({
  name: Joi.string().required().max(100),
  total: Joi.number().integer().positive().required(),
  debt: Joi.object({
    total: Joi.number().positive().integer().required(),
    note: Joi.string().max(300).required(),
    paid: Joi.boolean().required().default(false),
  })
    .optional()
    .allow(null),
  created_at: Joi.date().optional(),
});

export const updateExpenseValidation = Joi.object({
  name: Joi.string().optional().max(100),
  total: Joi.number().integer().positive().optional(),
});

export const listTransactionValdiation = Joi.object({
  search: Joi.string().optional().max(100),
  type: Joi.string().optional().max(100),
  time: Joi.array().items(Joi.string().required().max(100)).min(2).max(2),
});
