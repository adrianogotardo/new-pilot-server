export function errorHandler(error, req, res, next) {
    const { message, type } = error;

    switch(type) {
        case "conflict":
            return res.status(409).send(message || "Conflict");
        case "not_found":
            return res.status(404).send(message || "Not Found");
        case "unauthorized":
            return res.status(401).send(message || "Unauthorized");
        case "unprocessable_entity":
            return res.status(422).send(message || "Unprocessable Entity");
        case "internal_server_error":
            return res.status(500).send(message || "Internal Server Error");
        default:
            return res.status(500).send("Unknown Error");
    }
}
