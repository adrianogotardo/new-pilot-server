import Joi from 'joi';

export const addressSchema = Joi.object({
    street: Joi.string().max(255).required(),
    number: Joi.string().max(255).required(),
    complement: Joi.string().max(255).optional().allow(null, ''),
    neighbourhood: Joi.string().max(255).required(),
    city: Joi.string().max(255).required(),
    state: Joi.string().max(255).required(),
    postalCode: Joi.number().integer().required()
});