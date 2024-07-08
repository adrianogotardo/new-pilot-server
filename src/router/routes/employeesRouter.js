import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";
import { registerNewEmployee, getEmployeesList, updateEmployeeData, deleteEmployee, reintegrateEmployee } from "../../controllers/employeesControllers.js";

const employeesRouter = Router();

employeesRouter.use(roleValidator);
employeesRouter.post("/", timeZoneValidator, registerNewEmployee);
employeesRouter.get("/all", timeZoneValidator, getEmployeesList);
employeesRouter.put("/:id", updateEmployeeData);
employeesRouter.put("/reactivate/:id", reintegrateEmployee);
employeesRouter.delete("/:id", deleteEmployee);

export default employeesRouter;