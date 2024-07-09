import dotenv from "dotenv";
import { checkCryptSalt } from "./utils/checkCryptSalt.js"
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 5000;

checkCryptSalt() && app.listen(port, () => console.log(`Server sendo executado na porta ${port}`));