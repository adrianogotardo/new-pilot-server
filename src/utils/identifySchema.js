import { signUpSchema, signInSchema } from "../schemas/authenticationSchemas.js";
import { newEmployeeSchema } from "../schemas/employeesSchemas.js";
import { newWorkingSiteSchema } from "../schemas/workingSitesSchemas.js";

export function identifySchema(route) {
    switch(route) {
        case "POST/sign/up":
            return signUpSchema;
        case "POST/sign/in":
            return signInSchema;
        case "POST/employee":
            return newEmployeeSchema;
        case "POST/site":
            return newWorkingSiteSchema;
        default:
            return null;
    }
};