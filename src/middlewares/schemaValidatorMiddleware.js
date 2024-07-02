import { identifySchema } from "../utils/identifySchema.js";

export function schemaValidator(req, res, next) {
    const { method, url } = req;
    const request = method + url;
    const schema = identifySchema(request);
    if(schema === null) {
        return next();
    };

    const { error } = schema.validate(req.body);
    if(error) {
        throw { type: "unprocessable_entity", message: error.message };
    }

    return next();
};