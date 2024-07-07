import { getWorkingSiteByRegistrationNumber, createWorkingSite, createService, createMeasurement, createMeasurementService, getServicesByWorkingSiteId } from "../repositories/workingSitesRepositories.js";
import { createAddress } from "../repositories/addressesRepositories.js";
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