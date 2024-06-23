import { Router } from "express";

const authenticationRouter = Router();
const PATH = "/sign";

authenticationRouter.post(`${PATH}/in`, signIn);

export default authenticationRouter;