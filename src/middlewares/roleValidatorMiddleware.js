import jwt from "jsonwebtoken";

export function roleValidator(req, res, next) {
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

    if([3, 4].includes(user.role.id)) {
        return next();
    };
    
    return next({
        type: "unauthorized",
        message: "The user lacks permission to perform this operation"
    });
};