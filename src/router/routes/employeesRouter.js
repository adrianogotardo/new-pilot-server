import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";
import { registerNewEmployee, getEmployeesList, updateEmployeeData, deleteEmployee, reintegrateEmployee } from "../../controllers/employeesControllers.js";

const employeesRouter = Router();

employeesRouter.use(roleValidator);

employeesRouter.post("/", timeZoneValidator, registerNewEmployee);
// employeesRouter.post("/loan", );
// employeesRouter.post("/paycheck", );
// employeesRouter.post("/attendance", );

employeesRouter.get("/all", timeZoneValidator, getEmployeesList);
// employeesRouter.get("/:id/loan/all", );
// employeesRouter.get("/:id/paycheck/all", );
// employeesRouter.get("/:id/attendance/all", );

employeesRouter.put("/:id", updateEmployeeData);
// employeesRouter.put("/loan/:id", );
// employeesRouter.put("/paycheck/:id", );
// employeesRouter.put("/attendance/:id", );
employeesRouter.put("/reactivate/:id", reintegrateEmployee);

employeesRouter.delete("/:id", deleteEmployee);
// employeesRouter.delete("/loan/:id", );
// employeesRouter.delete("/paycheck/:id", );
// employeesRouter.delete("/attendance/:id", );

export default employeesRouter;