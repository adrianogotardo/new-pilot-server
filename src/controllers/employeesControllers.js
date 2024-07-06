import { checkDocumentAvailability, registerEmployee, getEmployees, updateEmployee, deactivateEmployee, reactivateEmployee } from "../services/employeesServices.js";

export async function registerNewEmployee(req, res) {
    const timeZone = req.headers['time-zone'];
    const employeeData = req.body;
    const { documentNumber } = employeeData;

    await checkDocumentAvailability(documentNumber);
    await registerEmployee(employeeData, timeZone);
    return res.sendStatus(201);
};

export async function getEmployeesList(req, res) {
    const { startDate = null, endDate = null, isActive = null } = req.query;
    const timeZone = req.headers['time-zone'];
    if(!!startDate !== !!endDate) throw {
        type: 'unprocessable entity',
        message: 'Date range is incomplete'
    };
    const employeesList = await getEmployees(startDate, endDate, isActive, timeZone);
    return res.status(200).send(employeesList);
};

export async function updateEmployeeData(req, res) {
    const employeeData = { ...req.body, id: +req.params.id };
    await updateEmployee(employeeData);
    return res.sendStatus(200);
};

export async function deleteEmployee(req, res) {
    const employeeId = +req.params.id;
    await deactivateEmployee(employeeId);
    return res.sendStatus(200);
}

export async function reintegrateEmployee(req, res) {
    const employeeId = +req.params.id;
    await reactivateEmployee(employeeId);
    return res.sendStatus(200);
}