import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";

const employeesRouter = Router();

employeesRouter.use(roleValidator);
employeesRouter.post("/", (req, res) => { return res.sendStatus(200) });   // createEmployee
employeesRouter.get("s", (req, res) => { return res.sendStatus(200) });    // getAllEmployees
employeesRouter.put("/", (req, res) => { return res.sendStatus(200) });    // updateEmployee
employeesRouter.delete("/", (req, res) => { return res.sendStatus(200) }); // deleteEmployee

export default employeesRouter;