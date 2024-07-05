export function timeZoneValidator(req, res, next) {
    const timeZone = req.headers['time-zone'] || null;
    if(!timeZone) return next({
        type: "unprocessable entity",
        message: "The request is missing the time zone header"
    });
    return next();
};