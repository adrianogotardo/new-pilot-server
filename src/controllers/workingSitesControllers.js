import { checkRegistrationNumberAvailability, registerWorkingSite, getWorkingSites, checkWorkingSiteId, createNewIncome, createNewService, createNewMeasurement, getWorkingSite } from "../services/workingSitesServices.js";
import { isValidDateString } from "../utils/isValidDateString.js";

export async function registerNewWorkingSite(req, res) {
    const workingSiteData = req.body;
    const { registrationNumber } = workingSiteData;

    await checkRegistrationNumberAvailability(registrationNumber);
    await registerWorkingSite(workingSiteData);

    return res.sendStatus(201);
};

export async function registerNewIncome(req, res) {
    const incomeData = { ...req.body, workingSiteId: +req.params.siteId };
    const timeZone = req.headers['time-zone'];
    const { workingSiteId } = incomeData;
    await checkWorkingSiteId(workingSiteId);
    await createNewIncome(incomeData, timeZone);

    return res.sendStatus(201);
};

export async function registerNewService(req, res) {
    const serviceData = { ...req.body, workingSiteId: +req.params.siteId };
    const timeZone = req.headers['time-zone'];
    const { workingSiteId } = serviceData;
    await checkWorkingSiteId(workingSiteId);
    await createNewService(serviceData, timeZone);
    return res.sendStatus(201);
};

export async function registerNewMeasurement(req, res) {
    const measurementData = { ...req.body, workingSiteId: +req.params.siteId };
    const timeZone = req.headers['time-zone'];
    const { workingSiteId } = measurementData;
    await checkWorkingSiteId(workingSiteId);
    await createNewMeasurement(measurementData, timeZone);
};

export async function getWorkingSitesList(req, res) {
    const { startDate = null, isArchived = null } = req.query;
    const timeZone = req.headers['time-zone'];

    if(startDate && !isValidDateString(startDate)) throw {
        type: 'unprocessable entity',
        message: 'Invalid date. Please make sure startDate value follow the ISO 8601 format ("YYYY-MM-DDTHH:mm:ssZ")'
    };

    if(isArchived !== 'true' && isArchived !== 'false' && isArchived !== null) throw {
        type: 'unprocessable entity',
        message: 'Invalid "isArchived" value. Please make sure that it is "true" or "false"'
    };

    const workingSitesList = await getWorkingSites(startDate, isArchived, timeZone);
    return res.status(200).send(workingSitesList);
};

export async function getOneWorkingSite(req, res) {
    const workingSiteId = +req.params.id;
    const workingSiteDetails = await getWorkingSite(workingSiteId);
    return res.status(200).send(workingSiteDetails);
};

export async function updateWorkingSiteData(req, res) {
    const workingSiteData = { ...req.body, id: +req.params.id };
    await updateWorkingSite(workingSiteData);
    return res.sendStatus(200);
}

export async function updateServideData(req, res) {
    const serviceData = { ...req.body, id: +req.params.siteId };
    await updateServide(serviceData);
    return res.sendStatus(200);
};

export async function updateMeasurementData(req, res) {
    const measurementData = { ...req.body, id: +req.params.siteId };
    await updateMeasurement(measurementData);
    return res.sendStatus(200);
};

export async function restartWorkingSite(req, res) {
    const workingSiteId = +req.params.id;
    await reactivateWorkinSite(workingSiteId);
    return res.sendStatus(200);
};