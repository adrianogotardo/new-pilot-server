import Joi from "joi";
import { addressSchema } from "./addressSchema.js";

export const newEmployeeSchema = Joi.object({
    name: Joi.string().required(),
    wage: Joi.number().integer().required(),
    phone: Joi.number().integer().optional().allow(null),
    documentNumber: Joi.string().required(),
    pix: Joi.string().optional().allow(null, ''),
    observation: Joi.string().optional().allow(null, ''),
    isActive: Joi.boolean().optional(),
    address: addressSchema.required()
});