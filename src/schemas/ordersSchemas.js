import Joi from "joi";

const newOrderItemSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().integer().required(),
    serviceId: Joi.number().integer().required(),
});

export const newOrderSchema = Joi.object({
    name: Joi.string().required(),
    workingSiteId: Joi.number().integer().required(),
    storeId: Joi.number().integer().required(),
    value: Joi.number().integer().required(),
    negotiatedValue: Joi.number().optional().allow(null, ''),
    cashValue: Joi.number().integer().required(),
    financedValue: Joi.number().integer().required(),
    observation: Joi.string().optional().allow(null, ''),
    cancelledAt: Joi.string().optional(),
    orderItems: Joi.array().items(newOrderItemSchema).required(),
});