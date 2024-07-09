import { getEmployeeByDocumentNumber, createEmployee, getEmployeesByCustomQuery, updateEmployeeById, getEmployeeById, deactivateEmployeeById, reactivateEmployeeById } from "../repositories/employeesRepositories.js";
import { createAddress, updateAddressById } from "../repositories/addressesRepositories.js";
import { dateRangeFormatter } from "../utils/dateRangeFormatter.js";
import moment from "moment-timezone";
import prisma from "../database.js";

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
    let newEmployee;

    await prisma.$transaction(async (transactionClient) => {
        const newAddress = await createAddress(address, transactionClient);
        employee.addressId = newAddress.id;
        employee.hiredAt = moment.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
        newEmployee = await createEmployee(employee, transactionClient);
        newEmployee.address = newAddress;
    });
    return newEmployee;
};

export async function getEmployees(startDate, endDate, isActive, timeZone) {
    let dbQuery = `SELECT e.id, e.name, e.wage, e.hired_at AT TIME ZONE 'UTC' AT TIME ZONE '${timeZone}' AS "hiredAt", e.address_id AS "addressId", e.phone, e.document_number, e.pix, e.is_active AS "isActive", e.observation, a.street, a.number, a.complement, a.neighbourhood, a.city, a.state, a.postal_code AS "postalCode" FROM employees e LEFT JOIN addresses a ON e.address_id = a.id`;
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

    const employeesList = await getEmployeesByCustomQuery(dbQuery);

    return employeesList;
};

export async function checkIfEmployeeIsRegistered(documentNumber) {
    const employeeWithThisDocumentNumber = await getEmployeeByDocumentNumber(documentNumber);
    if(!employeeWithThisDocumentNumber) throw {
        type: "not found",
        message: "Employee not found"
    };
    return;
};

export async function updateEmployee(employee) {
    const { id, address } = employee;
    if(!id) throw {
        type: "unprocessable entity",
        message: "Invalid employee id"
    };

    const oldEmployeeInfo = await getEmployeeById(id);
    if(!oldEmployeeInfo) throw {
        type: "not found",
        message: "Employee not found"
    };

    if(oldEmployeeInfo.document_number !== employee.documentNumber) throw {
        type: "conflict",
        message: "Document number belongs to another employee"
    };

    await prisma.$transaction(async (transactionClient) => {
        const { address_id } = oldEmployeeInfo;
        const newAddress = { ...address, id: address_id };
        await updateAddressById(newAddress, transactionClient);

        const newEmployee = { ...employee, addressId: address_id };
        await updateEmployeeById(newEmployee, transactionClient);
    });

    return;
};

export async function deactivateEmployee(employeeId) {
    if(!employeeId) throw {
        type: "unprocessable entity",
        message: "Invalid employee id"
    };

    const employee = await getEmployeeById(employeeId);
    if(!employee) throw {
        type: "not found",
        message: "Employee not found"
    };

    if(!employee.is_active) throw {
        type: "forbidden",
        message: "The employee already is inactive"
    };

    await deactivateEmployeeById(employeeId);
    return;
};

export async function reactivateEmployee(employeeId) {
    if(!employeeId) throw {
        type: "unprocessable entity",
        message: "Invalid employee id"
    };

    const employee = await getEmployeeById(employeeId);
    if(!employee) throw {
        type: "not found",
        message: "Employee not found"
    };

    if(employee.is_active) throw {
        type: "forbidden",
        message: "The employee already is active"
    }

    await reactivateEmployeeById(employeeId);
}