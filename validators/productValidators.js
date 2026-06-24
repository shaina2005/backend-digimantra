import Joi from "joi";

export const addProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required().min(3)
    .messages({
      "string.empty": "Product name is required",
      "any.required": "Product name is required",
    }),

  price: Joi.number()
    .min(1)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be greater than 0",
      "any.required": "Price is required",
    }),

  description: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),

  image: Joi.string()
    .required()
    .messages({
      "string.empty": "Image is required",
      "any.required": "Image is required",
    }),
});