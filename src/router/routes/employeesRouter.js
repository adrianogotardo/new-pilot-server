import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { registerNewEmployee, getEmployeesList } from "../../controllers/employeesControllers.js";

const employeesRouter = Router();

employeesRouter.use(roleValidator);
employeesRouter.post("/", registerNewEmployee);
employeesRouter.get("/", getEmployeesList);
employeesRouter.put("/", (req, res) => { return res.sendStatus(200) });    // updateEmployee
employeesRouter.delete("/", (req, res) => { return res.sendStatus(200) }); // deleteEmployee

export default employeesRouter;