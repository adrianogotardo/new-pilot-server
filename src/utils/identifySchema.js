import { signUpSchema, signInSchema } from "../schemas/authenticationSchemas.js";
import { newEmployeeSchema } from "../schemas/employeesSchemas.js";
import { newWorkingSiteSchema } from "../schemas/workingSitesSchemas.js";

export function identifySchema(route) {
    if(route.startsWith("POST/sign/up")) {
        return signUpSchema;
    };
    if(route.startsWith("POST/sign/in")) {
        return signInSchema;
    };
    if(route.startsWith("POST/employee")) {
        return newEmployeeSchema;
    };
    if(route.startsWith("PUT/employee/reactivate")){
        return null;
    };
    if(route.startsWith("PUT/employee")) {
        return newEmployeeSchema;
    };
    if(route.startsWith("POST/site")) {
        return newWorkingSiteSchema;
    };
    if(route.startsWith("PUT/site")) {
        return newWorkingSiteSchema;
    };
    return null;
};