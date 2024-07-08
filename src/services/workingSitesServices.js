import { getWorkingSiteByRegistrationNumber, createWorkingSite, createService, createMeasurement, createMeasurementService, getServicesByWorkingSiteId } from "../repositories/workingSitesRepositories.js";
import { createAddress, updateAddressById } from "../repositories/addressesRepositories.js";
import prisma from "../database.js";

export async function checkRegistrationNumberAvailability(registrationNumber) {
    const workingSiteWithThisRegistrationNumber = await getWorkingSiteByRegistrationNumber(registrationNumber);
    if(workingSiteWithThisRegistrationNumber) throw {
        type: "conflict",
        message: "Registration number is already in use"
    };
    return;
};

export async function registerWorkingSite(workingSite) {
    const { address, services, measurements } = workingSite;

    await prisma.$transaction(async (transactionClient) => {
        const newAddress = await createAddress(address, transactionClient);

        workingSite.addressId = newAddress.id;
        const newWorkingSite = await createWorkingSite(workingSite, transactionClient);
        for(const service of services) {
            service.workingSiteId = newWorkingSite.id;
            await createService(service, transactionClient);
        };

        for(const measurement of measurements) {
            measurement.workingSiteId = newWorkingSite.id;
            const newMeasurement = await createMeasurement(measurement, transactionClient);
            const availableServices = await getServicesByWorkingSiteId(newWorkingSite.id, transactionClient);
            for(const measurementService of measurement.services) {
                const service = availableServices.find(service => service.name === measurementService.name);
                measurementService.serviceId = service.id;
                measurementService.measurementId = newMeasurement.id;
                await createMeasurementService(measurementService, transactionClient);
            };
        };
    });

    return;
};

/*
export async function updateWorkingSite(workingSite) {
    const { id, address, services, measurements } = workingSite;
    if(!id) throw {
        type: "unprocessable entity",
        message: "Invalid construction site id"
    };

    const oldWorkingSiteInfo = await getWorkingSiteById(id);
    if(!oldWorkingSiteInfo) throw {
        type: "not found",
        message: "Construction site not found"
    };

    if(oldWorkingSiteInfo.registration_number !== workingSite.registrationNumber) throw {
        type: "conflict",
        message: "Registration number belongs to another construction site"
    };

    await prisma.$transaction(async (transactionClient) => { // preciso que o address venha com ID
        await deleteAllOf
        await updateAddressById(address, transactionClient);
        await updateWorkingSiteById(workingSite, transactionClient);
        
        for(const service of services) { // preciso que os services venham com ID
            service.workingSiteId = workingSite.id;
            await updateServiceById(service, transactionClient);
        };
        // PAREI AQUI:
        for(const measurement of measurements) { // preciso que os measurements venham com ID
            measurement.workingSiteId = newWorkingSite.id;
            const updatedMeasurement = await updateMeasurementById(measurement, transactionClient);
            const availableServices = await getServicesByWorkingSiteId(newWorkingSite.id, transactionClient);
            for(const measurementService of measurement.services) {
                const service = availableServices.find(service => service.name === measurementService.name);
                measurementService.serviceId = service.id;
                measurementService.measurementId = updatedMeasurement.id;
                await createMeasurementService(measurementService, transactionClient);
            };
        };
    });
    return;
};
*/