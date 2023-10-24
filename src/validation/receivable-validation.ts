import joi from "joi";

export const createReceivableValidation = joi.object({
  sale_id: joi.number().integer().positive().required(),
  total: joi.number().positive().integer().required(),
  note: joi.string().max(300).required(),
  paid: joi.boolean().required(),
});
export const updateReceivableValidation = joi.object({
  total: joi.number().positive().integer().optional(),
  note: joi.string().max(300).optional(),
  paid: joi.boolean().optional(),
});

export const listReceivableValidation = joi.object({
  time: joi
    .array()
    .items(joi.string().required().max(100))
    .optional()
    .min(2)
    .max(2),
  paid: joi.boolean(),
  search: joi.string().optional().max(100),
});
