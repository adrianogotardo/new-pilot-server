import { Router } from "express";
import { signUp, signIn } from "../../controllers/authenticationControllers.js";

const authenticationRouter = Router();
const PATH = "/sign";

authenticationRouter.post(`${PATH}/up`, signUp);
authenticationRouter.post(`${PATH}/in`, signIn);

export default authenticationRouter;