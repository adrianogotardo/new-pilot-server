import { Router } from "express";
import authenticationRouter from "./routes/authenticationRouter.js";
import employeesRouter from "./routes/employeesRouter.js";
import { errorHandler } from "../middlewares/errorHandlerMiddleware.js";
import { schemaValidator } from "../middlewares/schemaValidatorMiddleware.js";

const router = Router();

router.use(schemaValidator);
router.use("/sign", authenticationRouter);
router.use("/employee", employeesRouter);
router.use(errorHandler);

export default router;