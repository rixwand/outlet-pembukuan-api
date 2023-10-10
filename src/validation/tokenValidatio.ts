import Joi from "joi";

export const tokenValidation = Joi.string().max(300).required();
