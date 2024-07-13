import Joi from "joi";

export const newServiceSchema = Joi.object({
    name: Joi.string().required(),
    incidence: Joi.number().required(),
    estimatedCost: Joi.number().required(),
    estimatedStartDate: Joi.string().isoDate().required(),
    estimatedEndDate: Joi.string().isoDate().required(),
    approximateProgress: Joi.number().optional()
});