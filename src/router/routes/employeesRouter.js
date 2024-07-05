import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";
import { registerNewEmployee, getEmployeesList, updateEmployeeData } from "../../controllers/employeesControllers.js";

const employeesRouter = Router();

employeesRouter.use(roleValidator);
employeesRouter.use(timeZoneValidator);
employeesRouter.post("/", registerNewEmployee);
employeesRouter.get("/", getEmployeesList);
employeesRouter.put("/:id", updateEmployeeData);
employeesRouter.delete("/:id", (req, res) => {return res.sendStatus(200)});

export default employeesRouter;