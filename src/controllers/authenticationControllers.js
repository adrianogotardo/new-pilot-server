import { checkEmailAvailability, registerUser } from "../services/authenticationServices.js";

export async function signUp(req, res) {
    const { name, email, password } = req.body;

    const isEmailAvailable = await checkEmailAvailability(email);
    if(!isEmailAvailable) return res.status(409).send("Email already registered");

    await registerUser(name, email, password);
    return res.sendStatus(201);
};

//export function signIn(req, res) {
//    return res.status(200).send(req.body);
//};