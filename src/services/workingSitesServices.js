import { getWorkingSiteByRegistrationNumber, createWorkingSite, createService, createMeasurement, createMeasurementService, getServicesByWorkingSiteId, getWorkingSitesByStartDateAndIsArchived, getWorkingSitesByStartDate, getWorkingSitesByIsArchived, getAllWorkingSites, getGoalsByMeasurementId, getWorkingSiteById, createIncome } from "../repositories/workingSitesRepositories.js";
import { createAddress } from "../repositories/addressesRepositories.js";
import moment from "moment-timezone";
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

export async function checkWorkingSiteId(workingSiteId) {
    const workingSiteWithThisId = await getWorkingSiteById(workingSiteId);
    if(!workingSiteWithThisId) throw {
        type: "not found",
        message: '"workingSiteId" provided did not have any match' 
    };
    return;
};

export async function createNewIncome(incomeData, timeZone) {
    incomeData.receivedAt = moment.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
    await createIncome(incomeData);
    return;
};

export async function getWorkingSites(startDate, isArchived, timeZone) {
    const today = moment.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
    if(isArchived === 'true') isArchived = true;
    if(isArchived === 'false') isArchived = false;
    let workingSitesList;

    if(startDate && isArchived) {
        workingSitesList = await getWorkingSitesByStartDateAndIsArchived(startDate, isArchived, today);
    }
    else if(startDate) {
        workingSitesList = await getWorkingSitesByStartDate(startDate, today);
    }
    else if(isArchived) {
        workingSitesList = await getWorkingSitesByIsArchived(isArchived, today);
    }
    else {
        workingSitesList = await getAllWorkingSites(today);
    };

    for(const workingSite of workingSitesList) {
        workingSite.registrationNumber = workingSite.registration_number.toString();
        delete workingSite.registration_number;

        workingSite.estimatedStartDate = workingSite.estimated_start_date;
        delete workingSite.estimated_start_date;

        workingSite.estimatedEndDate = workingSite.estimated_end_date;
        delete workingSite.estimated_end_date;

        if(workingSite.measurements.length > 0) {

            workingSite.nextMeasurement = workingSite.measurements[0];
            delete workingSite.measurements;

            // pegar quais os serviços dessa medição e montar um array de metas dessa medição
            const nextMeasurementGoals = await getGoalsByMeasurementId(workingSite.nextMeasurement.id);
            workingSite.nextMeasurement.goals = [];
            for(const goal of nextMeasurementGoals) {
                workingSite.nextMeasurement.goals.push({
                    serviceId: goal.service_id,
                    serviceIncidence: goal.service.incidence,
                    serviceRequiredProgress: goal.required_conclusion_percentage,
                    serviceActualProgress: goal.service.approximate_progress
                });
            };

            if(workingSite.nextMeasurement.goals.length > 0) {
                let goalRequiredValue = 0;
                let goalActualValue = 0;
                for(const goal of workingSite.nextMeasurement.goals) {
                    goalRequiredValue += (goal.serviceIncidence * goal.serviceRequiredProgress);
                    if(goal.serviceRequiredProgress > goal.serviceActualProgress) {
                        goalActualValue += (goal.serviceIncidence * goal.serviceActualProgress);
                    } else {
                        goalActualValue += (goal.serviceIncidence * goal.serviceRequiredProgress);
                    };
                };
                workingSite.nextMeasurement.actualProgress = (goalActualValue / goalRequiredValue).toFixed(2);
            };
        }
        else {
            workingSite.nextMeasurement = null;
            delete workingSite.measurements;
        };
    };

    return workingSitesList;
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