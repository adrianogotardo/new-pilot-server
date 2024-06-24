import { getUserByEmail, createUser } from "../repositories/authenticationRepositories.js";
import bcrypt from 'bcrypt';
//import jwt from "jsonwebtoken";

export async function checkEmailAvailability(email) {
    const userWithThisEmail = await getUserByEmail(email);
    if(userWithThisEmail) return false;
    return true;
};

export async function registerUser(name, email, password) {
    const salt = +process.env.BCRYPT_SALT;
    password = await bcrypt.hash(password, salt);

    await createUser(name, email, password);
    return;
};