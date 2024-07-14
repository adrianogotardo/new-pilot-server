import { getWorkingSiteByRegistrationNumber, createWorkingSite, createService, createMeasurement, createMeasurementService, getServicesByWorkingSiteId, getWorkingSitesByStartDateAndIsArchived, getWorkingSitesByStartDate, getWorkingSitesByIsArchived, getAllWorkingSites, getGoalsByMeasurementId, getWorkingSiteById, createIncome, updateService } from "../repositories/workingSitesRepositories.js";
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
    if(!workingSiteId) throw {
        type: "unprocessable entity",
        message: "Invalid working site id"
    };
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

export async function createNewService(serviceData) {
    const { workingSiteId } = serviceData;
    await prisma.$transaction(async (transactionClient) => {
        let previousServices = await getServicesByWorkingSiteId(workingSiteId);
        for(const service of previousServices) {
            service.incidence -= ((service.incidence * serviceData.incidence) / 10000).toFixed(0);
            await updateService(service, transactionClient);
        };
        await createService(serviceData, transactionClient);
    });
    return;
};

export async function createNewMeasurement(measurementData) {
    const { workingSiteId, services } = measurementData;
    await prisma.$transaction(async (transactionClient) => {
        const newMeasurement = await createMeasurement(measurementData, transactionClient);
        const availableServices = await getServicesByWorkingSiteId(workingSiteId, transactionClient);
        for(const measurementService of services) {
            const service = availableServices.find(service => service.name === measurementService.name);
            measurementService.serviceId = service.id;
            measurementService.measurementId = newMeasurement.id;
            await createMeasurementService(measurementService, transactionClient);
        };
    });
    return;
};

export async function getWorkingSites(startDate, isArchived, timeZone) {
    const today = moment.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');
    if(isArchived === 'true') isArchived = true;
    if(isArchived === 'false') isArchived = false;
    let workingSitesList;
    if(startDate && isArchived) workingSitesList = await getWorkingSitesByStartDateAndIsArchived(startDate, isArchived, today);
    else if(startDate) workingSitesList = await getWorkingSitesByStartDate(startDate, today);
    else if(isArchived) workingSitesList = await getWorkingSitesByIsArchived(isArchived, today);
    else workingSitesList = await getAllWorkingSites(today);
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
        } else {
            workingSite.nextMeasurement = null;
            delete workingSite.measurements;
        };
    };
    return workingSitesList;
};

export async function getWorkingSite(workingSiteId) {
    if(!workingSiteId) throw {
        type: "unprocessable entity",
        message: "Invalid working site id"
    };
    const workingSiteWithThisId = await getWorkingSiteById(workingSiteId);
    if(!workingSiteWithThisId) throw {
        type: "not found",
        message: '"workingSiteId" provided did not have any match' 
    };
    workingSiteWithThisId.registrationNumber = workingSiteWithThisId.registration_number.toString();
    workingSiteWithThisId.estimatedStartDate = workingSiteWithThisId.estimated_start_date;
    workingSiteWithThisId.estimatedEndDate = workingSiteWithThisId.estimated_end_date;
    workingSiteWithThisId.isArchived = workingSiteWithThisId.is_archived;
    delete workingSiteWithThisId.registration_number;
    delete workingSiteWithThisId.estimated_start_date;
    delete workingSiteWithThisId.estimated_end_date;
    delete workingSiteWithThisId.is_archived;
    for(const service of workingSiteWithThisId.services) {
        service.workingSiteId = service.working_site_id;
        service.approximateProgress = service.approximate_progress;
        service.estimatedCost = service.estimated_cost.toString();
        service.estimatedStartDate = service.estimated_start_date;
        service.estimatedEndDate = service.estimated_end_date;
        service.realStartDate = service.real_start_date;
        service.realEndDate = service.real_end_date;
        delete service.working_site_id;
        delete service.approximate_progress;
        delete service.estimated_cost;
        delete service.estimated_start_date;
        delete service.estimated_end_date;
        delete service.real_start_date;
        delete service.real_end_date;
    };
    for(const measurement of workingSiteWithThisId.measurements) {
        measurement.workingSiteId = measurement.working_site_id;
        measurement.measurementsServices = measurement.measurements_services;
        delete measurement.working_site_id;
        delete measurement.measurements_services;
        for(const measurementService of measurement.measurementsServices) {
            measurementService.measurementId = measurementService.measurement_id;
            measurementService.serviceId = measurementService.service_id;
            measurementService.requiredConclusionPercentage = measurementService.required_conclusion_percentage;
            delete measurementService.measurement_id;
            delete measurementService.service_id;
            delete measurementService.required_conclusion_percentage;
        };
    };
    console.log("working site details: ", workingSiteWithThisId);
    return workingSiteWithThisId;
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