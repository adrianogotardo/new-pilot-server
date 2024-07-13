import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";

const storesRouter = Router();

storesRouter.use(roleValidator);

// storesRouter.post("/", timeZoneValidator, );

// storesRouter.get("/all", timeZoneValidator, );

// storesRouter.put("/:id", );

// storesRouter.delete("/:id" );

export default storesRouter;