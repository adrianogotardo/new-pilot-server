import Joi from "joi";

export const newIncomeSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().required()
});