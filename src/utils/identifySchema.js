import { signUpSchema, signInSchema } from "../schemas/authenticationSchemas.js";
import { newEmployeeSchema } from "../schemas/employeesSchemas.js";
import { newWorkingSiteSchema } from "../schemas/workingSitesSchemas.js";
import { newIncomeSchema } from '../schemas/incomesSchemas.js';
import { newOrderSchema } from "../schemas/ordersSchemas.js";

export function identifySchema(route) {
    // authentication routes
    if(route.startsWith("POST/sign/up")) return signUpSchema;
    if(route.startsWith("POST/sign/in")) return signInSchema;

    // employee routes
    if(route.startsWith("POST/employee")) return newEmployeeSchema;
    if(route.startsWith("PUT/employee/reactivate"))return null;
    if(route.startsWith("PUT/employee")) return newEmployeeSchema;

    // working site routes
    if(route.startsWith("POST/site/income")) return newIncomeSchema;
    if(route.startsWith("POST/site")) return newWorkingSiteSchema;
    if(route.startsWith("PUT/site")) return newWorkingSiteSchema;

    // orders routes
    if(route.startsWith("POST/order")) return newOrderSchema;

    return null;
};