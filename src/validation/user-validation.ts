import joi from "joi";

export const registerValidation = joi.object({
  username: joi.string().required().max(100),
  email: joi.string().email().required().max(100),
  password: joi.string().required().max(100),
});

export const loginValidation = joi.object({
  email: joi.string().email().required().max(100),
  password: joi.string().required().max(100),
});

export const getUserValidation = joi.string().required().max(100);

export const updateValidation = joi.object({
  email: joi.string().email().optional().max(100),
  username: joi.string().optional().max(100),
  passwordUpdate: joi
    .object({
      oldPassword: joi.string().required().max(100),
      newPassword: joi.string().required().max(100),
    })
    .optional(),
});
