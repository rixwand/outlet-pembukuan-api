import joi from "joi";
export const updateDebtValidation = joi.object({
  total: joi.number().positive().integer().optional(),
  note: joi.string().max(300).optional(),
  paid: joi.boolean().optional(),
});

export const createDebtValidation = joi.object({
  total: joi.number().positive().integer().required(),
  note: joi.string().max(300).required(),
  paid: joi.boolean().required().default(false),
  expense_id: joi.number().positive().integer().optional(),
  created_at: joi.date().optional(),
});

export const listDebtValidation = joi.object({
  time: joi
    .array()
    .items(joi.string().required().max(100))
    .optional()
    .min(2)
    .max(2),
  paid: joi.boolean().optional(),
  search: joi.string().optional().max(100),
});
