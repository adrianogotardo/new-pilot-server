import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { timeZoneValidator } from "../../middlewares/timeZoneValidatorMiddleware.js";
import { getOrdersList } from "../../controllers/ordersController.js";

const ordersRouter = Router();

ordersRouter.use(roleValidator);

// ordersRouter.post("/", timeZoneValidator, registerNewOrder);

ordersRouter.get("/all", timeZoneValidator, getOrdersList);

// ordersRouter.put("/:id", );

// ordersRouter.delete("/:id" );

export default ordersRouter;