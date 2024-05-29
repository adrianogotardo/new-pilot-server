import { Router } from "express";
import firsRouter from "./firstRouter.js";

const router = Router();

router.use(firsRouter);

export default router;