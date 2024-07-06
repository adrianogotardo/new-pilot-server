import { getUserByEmail, createUser } from "../repositories/authenticationRepositories.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export async function checkEmailAvailability(email) {
    const userWithThisEmail = await getUserByEmail(email);
    if(userWithThisEmail) throw {
        type: "conflict",
        message: "Email already registered"
    };
    return;
};

export async function registerUser(name, email, password) {
    const salt = +process.env.BCRYPT_SALT;
    password = await bcrypt.hash(password, salt);
    await createUser(name, email, password);
    return;
};

export async function getUserInfo(email) {
    const userWithThisEmail = await getUserByEmail(email);
    if(!userWithThisEmail) throw {
        type: "not found",
        message: "There is no user registered by this email address"
    };
    return userWithThisEmail;
};

export async function verifyPassword(receivedPassword, storedPassword) {
    const isPasswordCorrect = await bcrypt.compare(receivedPassword, storedPassword);
    if(!isPasswordCorrect) throw {
        type: "unauthorized",
        message: "Incorrect password. Please try again"
    };
    return;
}

export function createSession(userInfo) {
    const { id, name, email, role } = userInfo;
    const newTokenData = {
        id: id,
        name: name,
        email: email,
        role: role
    };
    const tokensSecret = process.env.SERVER_SECRET;
    const newToken = jwt.sign(newTokenData, tokensSecret);
    return newToken;
}