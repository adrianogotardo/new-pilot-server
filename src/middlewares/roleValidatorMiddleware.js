import jwt from "jsonwebtoken";
import { getUserByEmail } from "../repositories/authenticationRepositories.js";

export async function roleValidator(req, res, next) {
    const tokensSecret = process.env.SERVER_SECRET;
    const token = req.headers.authorization?.split(' ')[1];
    let user;

    if(!token) {
        return next({ type: "jwt must be provided" });
    };
    
    try {
        user = jwt.verify(token, tokensSecret);
    } catch (error) {
        return next({ type: error.message })
    };

    await getUserByEmail(user.email).then((userFromDatabase) => {
        if (!userFromDatabase) {
            return next({ type: "invalid token", message: "The provided token doesn't correspond to any registered user" });
        };
        if (['root', 'admin'].includes(userFromDatabase.role.name)) {
            return next();
        };
        return next({
            type: "unauthorized",
            message: "The user lacks permission to perform this operation"
        });
    }).catch((error) => {
        return next({ type: "internal error", message: error.message });
    });
    
};