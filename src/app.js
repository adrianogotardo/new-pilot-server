import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import router from "./router/router.js";

const app = express();
app.use(json());
app.use(cors());
app.use(router);

export default app;