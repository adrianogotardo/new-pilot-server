import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { registerNewWorkingSite, getWorkingSitesList, registerNewIncome } from "../../controllers/workingSitesControllers.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";

const workingSitesRouter = Router();

workingSitesRouter.use(roleValidator);

workingSitesRouter.post("/", registerNewWorkingSite);
// workingSitesRouter.post("/service", timeZoneValidator, registerNewService);
// workingSitesRouter.post("/measurement", timeZoneValidator, registerNewMeasurement);
workingSitesRouter.post("/income", timeZoneValidator, registerNewIncome);

workingSitesRouter.get("/all", timeZoneValidator, getWorkingSitesList);
// workingSitesRouter.get("/:id", timeZoneValidator, getOneWorkingSite);

// workingSitesRouter.put("/:id", );
// workingSitesRouter.put("/service/:id", );
// workingSitesRouter.put("/measurement/:id", );
// workingSitesRouter.put("/reactivate/:id", );

// workingSitesRouter.delete("/:id", );
// workingSitesRouter.delete("/service/:id", );
// workingSitesRouter.delete("/measurement/:id", );

export default workingSitesRouter;