import prisma from "../database.js";

export async function createAddress(address, transactionClient) {
    const { street, number, complement = null, neighbourhood, city, state, postalCode } = address;
    const operationDetails = {
        data: {
            street: street,
            number: number,
            complement: complement,
            neighbourhood: neighbourhood,
            city: city,
            state: state,
            postal_code: postalCode,
        },
    }
    let newAddress;
    if(transactionClient) {
        newAddress = await transactionClient.addresses.create(operationDetails);
    } else {
        newAddress = await prisma.addresses.create(operationDetails);
    };
    return newAddress;
};

export async function getAddressById(addressId) {
    const address = await prisma.addresses.findUnique({
        where: {
            id: addressId
        }
    });
    return address;
};

export async function updateAddressById(address) {
    const { id, street, number, complement = null, neighbourhood, city, state, postalCode } = address;
    await prisma.addresses.update({
        where: { id: id },
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
    return;
};