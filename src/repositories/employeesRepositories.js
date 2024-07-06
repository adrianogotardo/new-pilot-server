import prisma from "../database.js";

export async function createEmployee(employee) {
    const { name, wage, phone = null, documentNumber, pix = null, observation = null, addressId, hiredAt } = employee;
    const newEmployee = await prisma.employees.create({
        data: {
            name,
            wage,
            phone,
            document_number: documentNumber,
            pix,
            observation,
            address_id: addressId,
            hired_at: hiredAt
        },
    });
    return newEmployee;
};

export async function getEmployeeByDocumentNumber(documentNumber) {
    const employee = await prisma.employees.findUnique({
        where: {
            document_number: documentNumber
        }
    });
    return employee;
};

export async function getEmployeeById(employeeId) {
    const employee = await prisma.employees.findUnique({
        where: {
            id: employeeId
        }
    });
    return employee;
};

export async function getEmployeesByCustomQuery(dbQuery) {
    const employeesList = await prisma.$queryRawUnsafe(dbQuery);
    return employeesList;
};

export async function updateEmployeeById(employee) {
    const { id, name, wage, phone = null, documentNumber, pix = null, observation = null, addressId } = employee;
    await prisma.employees.update({
        where: { id: id },
        data: {
            name,
            wage,
            phone,
            document_number: documentNumber,
            pix,
            observation,
            address_id: addressId,
          },
    });
    return;
};

export async function deactivateEmployeeById(employeeId) {
    await prisma.employees.update({
        where: { id: employeeId },
        data: {
            is_active: false,
        },
    });
    return;
};

export async function reactivateEmployeeById(employeeId) {
    await prisma.employees.update({
        where: { id: employeeId },
        data: {
            is_active: true,
        },
    });
    return;
};