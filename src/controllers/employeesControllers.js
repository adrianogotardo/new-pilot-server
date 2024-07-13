import { checkDocumentAvailability, registerEmployee, getEmployees, updateEmployee, deactivateEmployee, reactivateEmployee } from "../services/employeesServices.js";
import { isValidDateString } from "../utils/isValidDateString.js";

export async function registerNewEmployee(req, res) {
    const { isActive = null } = req.body;
    const timeZone = req.headers['time-zone'];
    const employeeData = req.body;
    const { documentNumber } = employeeData;
    if(isActive !== 'true' && isActive !== 'false' && isActive !== null) throw {
        type: 'unprocessable entity',
        message: 'Invalid "isActive" value. Please make sure that it is "true" or "false"'
    };
    if(isActive === 'true') req.body.isActive = true;
    if(isActive === 'false') req.body.isActive = false;

    await checkDocumentAvailability(documentNumber);

    let newEmployee = await registerEmployee(employeeData, timeZone);
    const { document_number, is_active, hired_at, address_id } = newEmployee;

    newEmployee = { 
        ...newEmployee,
        wage: newEmployee.wage?.toString(),
        phone: newEmployee.phone?.toString(),
        addressId: address_id,
        documentNumber: document_number,
        isActive: is_active,
        hiredAt: hired_at,
        address: {
            ...newEmployee.address,
            postalCode: newEmployee.address.postal_code?.toString()
        }
    };

    delete newEmployee.document_number;
    delete newEmployee.address_id;
    delete newEmployee.is_active;
    delete newEmployee.hired_at;
    delete newEmployee.address.postal_code;
    delete newEmployee.address.id;

    return res.status(201).send(newEmployee);
};

export async function getEmployeesList(req, res) {
    const { startDate = null, endDate = null, isActive = null } = req.query;
    const timeZone = req.headers['time-zone'];
    if(!!startDate !== !!endDate) throw {
        type: 'unprocessable entity',
        message: 'Date range is incomplete'
    };
    if((startDate && endDate) && (!isValidDateString(startDate) || !isValidDateString(endDate))) throw {
        type: 'unprocessable entity',
        message: 'Invalid date. Please make sure all date values follow the ISO 8601 format ("YYYY-MM-DDTHH:mm:ssZ")'
    };
    if(isActive !== 'true' && isActive !== 'false' && isActive !== null) throw {
        type: 'unprocessable entity',
        message: 'Invalid "isActive" value. Please make sure that it is "true" or "false"'
    };
    
    const employeesList = await getEmployees(startDate, endDate, isActive, timeZone);
    const formattedEmployeesList = employeesList.map(employee => {
        const { addressId, street, number, complement, neighbourhood, city, state, postalCode } = employee;
        const address = { addressId, street, number, complement, neighbourhood, city, state, postalCode };
        ['addressId', 'street', 'number', 'complement', 'neighbourhood', 'city', 'state', 'postalCode'].forEach(key => delete employee[key]);
        employee.address = address;
        employee.wage = employee.wage?.toString();
        employee.phone = employee.phone?.toString();
        employee.address.postalCode = employee.address.postalCode?.toString();
        return employee;
    });
    return res.status(200).send(formattedEmployeesList);
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