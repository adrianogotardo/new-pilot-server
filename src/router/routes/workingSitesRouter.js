import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { registerNewWorkingSite, getWorkingSitesList, registerNewIncome, registerNewService, registerNewMeasurement, getOneWorkingSite } from "../../controllers/workingSitesControllers.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";

const workingSitesRouter = Router();

workingSitesRouter.use(roleValidator);

workingSitesRouter.post("/", registerNewWorkingSite);
workingSitesRouter.post("/service/:siteId", timeZoneValidator, registerNewService);
workingSitesRouter.post("/measurement/:siteId", timeZoneValidator, registerNewMeasurement);
workingSitesRouter.post("/income/:siteId", timeZoneValidator, registerNewIncome);

workingSitesRouter.get("/all", timeZoneValidator, getWorkingSitesList);
workingSitesRouter.get("/details/:id", timeZoneValidator, getOneWorkingSite);

workingSitesRouter.put("/:id", updateWorkingSiteData);
workingSitesRouter.put("/service/:serviceId", updateServideData);
workingSitesRouter.put("/measurement/:measurementId", updateMeasurementData);
workingSitesRouter.put("/reactivate/:id", restartWorkingSite);

// workingSitesRouter.delete("/:id", );
// workingSitesRouter.delete("/service/:id", );
// workingSitesRouter.delete("/measurement/:id", );

export default workingSitesRouter;