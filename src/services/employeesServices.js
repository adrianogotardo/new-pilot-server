import { getEmployeeByDocumentNumber, createAddress, createEmployee, selectEmployees } from "../repositories/employeesRepositories.js";
import moment from "moment-timezone";
import { dateRangeFormatter } from "../utils/dateRangeFormatter.js";

export async function checkDocumentAvailability(documentNumber) {
    const employeeWithThisDocumentNumber = await getEmployeeByDocumentNumber(documentNumber);
    if(employeeWithThisDocumentNumber) throw {
        type: "conflict",
        message: "Document number is already registered"
    };
    return;
};

export async function registerEmployee(employee, timeZone) {
    const { address } = employee;
    const newAddress = await createAddress(address);

    if(!timeZone) throw {
        type: "unprocessable entity",
        message: "The request is missing the time zone header"
    }

    employee.addressId = newAddress.id;
    employee.hiredAt = moment.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
    await createEmployee(employee);
    return;
};

export async function getEmployees(startDate, endDate, isActive, timeZone) {
    if(!timeZone) throw {
        type: "unprocessable entity",
        message: "The request is missing the time zone header"
    }

    let dbQuery = `SELECT e.id, e.name, e.wage, e.hired_at AT TIME ZONE 'UTC' AT TIME ZONE '${timeZone}', e.phone, e.document_number, e.pix, e.is_active, e.observation, a.street, a.number, a.complement, a.neighbourhood, a.city, a.state, a.postal_code FROM employees e LEFT JOIN addresses a ON e.address_id = a.id`;
    if((startDate && endDate) || isActive) {
        dbQuery += ' WHERE';

        if(startDate && endDate) {
            startDate = dateRangeFormatter(startDate, 'start');
            endDate = dateRangeFormatter(endDate, 'end');
            dbQuery += ` hired_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate}' AND TIMESTAMP WITH TIME ZONE '${endDate}'`;
        };

        if(startDate && endDate && isActive) {
            dbQuery += ' AND';
        };

        if(isActive) {
            dbQuery += ` is_active = '${isActive}'`;
        };
    };
    dbQuery+= ';';

    const employeesList = await selectEmployees(dbQuery);
    
    const employeesListWithBigIntAsString = employeesList.map(employee => ({
        ...employee,
        wage: employee.wage?.toString(),
        phone: employee.phone?.toString(),
        postal_code: employee.postal_code?.toString(),
    }));

    return employeesListWithBigIntAsString;
};
