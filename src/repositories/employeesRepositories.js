import prisma from "../database.js";

export async function getEmployeeByDocumentNumber(documentNumber) {
    const employee = await prisma.employees.findUnique({
        where: {
            document_number: documentNumber
        }
    });
    return employee;
};

export async function createAddress(address) {
    const { street, number, complement, neighbourhood, city, state, postalCode } = address;
    const newAddress = await prisma.addresses.create({
        data: {
            street: street,
            number: number,
            complement: complement,
            neighbourhood: neighbourhood,
            city: city,
            state: state,
            postal_code: postalCode,
        },
    });
    return newAddress;
};

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

export async function selectEmployees(dbQuery) {
    const employeesList = await prisma.$queryRawUnsafe(dbQuery);
    return employeesList;
}