import prisma from "../database.js";

export async function createEmployee(employee) {
    const { name, wage, phone = null, documentNumber, pix = null, observation = null, addressId, hiredAt } = employee;
    const operationDetails = {
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
    }
    let newEmployee;
    if(transactionClient) await transactionClient.employees.create(operationDetails);
    else await prisma.employees.create(operationDetails);
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

export async function updateEmployeeById(employee, transactionClient) {
    const { id, name, wage, phone = null, documentNumber, pix = null, observation = null, addressId } = employee;
    const operationDetails = {
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
    }
    if(transactionClient) {
        await transactionClient.employees.update(operationDetails);
    } else {
        await prisma.employees.update(operationDetails);
    }
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