import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandlerMiddleware.js";
import dotenv from "dotenv";
import { checkCryptSalt } from "./utils/checkCryptSalt.js"

dotenv.config();
const port = process.env.PORT || 5000;

async function startServer() {
    const app = express();
    app.use(json());
    app.use(cors());
    app.use(router);
    app.use(errorHandler);
    return app;
}

checkCryptSalt() && startServer().then(
    (app) => app.listen(port, () => console.log(`Server sendo executado na porta ${port}`))
).catch(
    (error) => console.log(error)
);

