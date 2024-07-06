export function errorHandler(error, req, res, next) {
    const { message, type } = error;

    switch(type) {
        case "conflict":
            return res.status(409).send(message || "Conflict");

        case "not found":
            return res.status(404).send(message || "Not Found");

        case "unauthorized":
            return res.status(401).send(message || "Unauthorized");

        case "unprocessable entity":
            return res.status(422).send(message || "Unprocessable Entity");
            
        case "jwt must be provided":
            return res.status(401).send(message || "The request is missing the authorization header");

        case "invalid token":
            return res.status(401).send(message || "The provided token is incomplete or incorrect and doesn't correspond to any registered user");

        case "jwt expired":
            return res.status(401).send(message || "The provided token is expired");

        case "jwt malformed":
            return res.status(401).send(message || "The provided token doesn't have three components (delimited by a '.')");

        case "internal server error":
            return res.status(500).send(message || "Internal Server Error");

        default:
            return res.status(500).send("System error: " + message);
    }
}
