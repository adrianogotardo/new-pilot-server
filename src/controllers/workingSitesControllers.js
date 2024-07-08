import { checkRegistrationNumberAvailability, registerWorkingSite } from "../services/workingSitesServices.js";

export async function registerNewWorkingSite(req, res) {
    const workingSiteData = req.body;
    const { registrationNumber } = workingSiteData;

    await checkRegistrationNumberAvailability(registrationNumber);
    await registerWorkingSite(workingSiteData);

    return res.sendStatus(201);
};

/*
export async function updateWorkingSiteData(req, res) {
    const workingSiteData = { ...req.body, id: +req.params.id };
    await updateWorkingSite(workingSiteData);
    return res.sendStatus(200);
}
*/