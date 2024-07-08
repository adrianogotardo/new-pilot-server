import { Router } from "express";
import { roleValidator } from "../../middlewares/roleValidatorMiddleware.js";
import { getOrdersList, getOneOrder } from "../../controllers/ordersController.js";

const ordersRouter = Router();

ordersRouter.use(roleValidator);
ordersRouter.get("/all", getOrdersList);
ordersRouter.get("/:id", getOneOrder);

export default ordersRouter;