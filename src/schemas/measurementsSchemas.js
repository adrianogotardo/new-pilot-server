import Joi from "joi";

const measurementService = Joi.object({
    name: Joi.string().required(),
    requiredProgress: Joi.number().required()
});

export const newMeasurementSchema = Joi.object({
    date: Joi.string().isoDate().required(),
    services: Joi.array().items(measurementService).required()
});