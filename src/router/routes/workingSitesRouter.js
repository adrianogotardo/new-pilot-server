import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { registerNewWorkingSite } from "../../controllers/workingSitesControllers.js";

const workingSitesRouter = Router();

workingSitesRouter.use(roleValidator);
workingSitesRouter.post("/", registerNewWorkingSite);
//workingSitesRouter.get("/all", );
//workingSitesRouter.get("/:id/details", );
//workingSitesRouter.put("/:id", );
//workingSitesRouter.delete("/:id", );

export default workingSitesRouter;