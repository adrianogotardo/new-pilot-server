import { signUpSchema } from "../schemas/signUpSchema.js";
import { signInSchema } from "../schemas/signInSchema.js";

export function identifySchema(route) {
    switch(route) {
        case "/sign/up":
            return signUpSchema;
        case "/sign/in":
            return signInSchema;
        default:
            return null;
    }
};