import prisma from "../database.js";

export async function createAddress(address) {
    const { street, number, complement = null, neighbourhood, city, state, postalCode } = address;
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