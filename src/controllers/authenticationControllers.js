import { checkEmailAvailability, getUserInfo, registerUser, verifyPassword, createSession } from "../services/authenticationServices.js";

export async function signUp(req, res) {
    const { name, email, password } = req.body;
    await checkEmailAvailability(email);
    await registerUser(name, email, password);
    return res.sendStatus(201);
};

export async function signIn(req, res) {
    const { email, password } = req.body;
    const storedUserInfo = await getUserInfo(email);
    await verifyPassword(password, storedUserInfo.password);
    const signInToken = createSession(storedUserInfo);
    return res.status(200).send(signInToken);
};