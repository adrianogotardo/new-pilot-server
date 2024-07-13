import Joi from "joi";
import { addressSchema } from "./addressSchema.js";
import { newServiceSchema } from "./servicesSchemas.js";
import { newMeasurementSchema } from "./measurementsSchemas.js";

export const newWorkingSiteSchema = Joi.object({
    name: Joi.string().required(),
    registrationNumber: Joi.number().integer().required(),
    estimatedStartDate: Joi.string().isoDate().required(),
    estimatedEndDate: Joi.string().isoDate().required(),
    address: addressSchema.required(),
    services: Joi.array().items(newServiceSchema).required(),
    measurements: Joi.array().items(newMeasurementSchema).required(),
    isArchived: Joi.boolean().optional()
});