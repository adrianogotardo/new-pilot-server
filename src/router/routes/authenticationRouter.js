import { Router } from "express";
import { signUp, signIn } from "../../controllers/authenticationControllers.js";

const authenticationRouter = Router();

authenticationRouter.post(`/up`, signUp);
authenticationRouter.post(`/in`, signIn);

export default authenticationRouter;