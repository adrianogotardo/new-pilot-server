import Joi from "joi";

const measurementService = Joi.object({
    name: Joi.string().required(),
    requiredProgress: Joi.number().integer().min(1).max(10000).required()
});

export const newMeasurementSchema = Joi.object({
    date: Joi.string().isoDate().required(),
    services: Joi.array().items(measurementService).required()
});