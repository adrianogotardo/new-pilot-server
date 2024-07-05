import { checkDocumentAvailability, registerEmployee, getEmployees } from "../services/employeesServices.js";

export async function registerNewEmployee(req, res) {
    const timeZone = req.headers['time-zone'] || null;
    const employeeData = req.body;
    const { documentNumber } = employeeData;
    await checkDocumentAvailability(documentNumber);
    await registerEmployee(employeeData, timeZone);
    return res.sendStatus(201);
};

export async function getEmployeesList(req, res) {
    const { startDate = null, endDate = null, isActive = null } = req.query;
    const timeZone = req.headers['time-zone'] || null;
    if(!!startDate !== !!endDate) throw {
        type: 'unprocessable entity',
        message: 'Date range is incomplete'
    };
    const employeesList = await getEmployees(startDate, endDate, isActive, timeZone);
    return res.status(200).send(employeesList);
};