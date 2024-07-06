import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import router from "./router/router.js";
import dotenv from "dotenv";
import { checkCryptSalt } from "./utils/checkCryptSalt.js"

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(json());
app.use(cors());
app.use(router);

checkCryptSalt() && app.listen(port, () => console.log(`Server sendo executado na porta ${port}`));

