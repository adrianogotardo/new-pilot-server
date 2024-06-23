import Joi from "joi";

const signInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

// para cada rota que possui validaçao de schema, passa-se o schema correto
// para rotas que nao possuem validaçao de schema (default), passa-se null

export function identifySchema(route) {
    switch(route) {
        case "/sign/in":
            return signInSchema;
        default:
            return null;
    }
};