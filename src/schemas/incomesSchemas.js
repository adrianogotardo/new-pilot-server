import Joi from "joi";

export const newIncomeSchema = Joi.object({
    name: Joi.string().required(),
    workingSiteId: Joi.number().required(),
    value: Joi.number().required()
});