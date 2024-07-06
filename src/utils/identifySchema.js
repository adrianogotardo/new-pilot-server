import { signUpSchema, signInSchema } from "../schemas/authenticationSchemas.js";
import { newEmployeeSchema } from "../schemas/employeesSchemas.js";

export function identifySchema(route) {
    switch(route) {
        case "POST/sign/up":
            return signUpSchema;
        case "POST/sign/in":
            return signInSchema;
        case "POST/employee":
            return newEmployeeSchema;
        default:
            return null;
    }
};