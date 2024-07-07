import prisma from "../database.js";

export async function getWorkingSiteByRegistrationNumber(registrationNumber, transactionClient) {
    const operationDetails = {
        where: {
            registration_number: registrationNumber
        }
    }
    let workingSite;
    if(transactionClient) {
        workingSite = await transactionClient.working_sites.findUnique(operationDetails);
    } else {
        workingSite = await prisma.working_sites.findUnique(operationDetails);
    };
    return workingSite;
};

export async function createWorkingSite(workingSite, transactionClient) {
    const { name, registrationNumber, addressId } = workingSite;
    const operationDetails = {
        data: {
            name,
            registration_number: registrationNumber,
            address_id: addressId
        },
    }
    let newWorkingSite;
    if(transactionClient) {
        newWorkingSite = await transactionClient.working_sites.create(operationDetails);
    } else {
        newWorkingSite = await prisma.working_sites.create(operationDetails);
    };
    return newWorkingSite;
};

export async function createService(service, transactionClient) {
    const { name, incidence, estimatedCost, estimatedStartDate, estimatedEndDate, workingSiteId } = service;
    const operationDetails = {
        data: {
            name,
            incidence,
            working_site_id: workingSiteId,
            estimated_cost: estimatedCost,
            estimated_start_date: estimatedStartDate,
            estimated_end_date: estimatedEndDate
        },
    }
    let newService;
    if(transactionClient) {
        newService = await transactionClient.services.create(operationDetails);
    } else {
        newService = await prisma.services.create(operationDetails);
    };
    return newService;
};

export async function createMeasurement(measurement, transactionClient) {
    const { date, workingSiteId } = measurement;
    const operationDetails = {
        data: {
            date,
            working_site_id: workingSiteId
        },
    }
    let newMeasurement;
    if(transactionClient) {
        newMeasurement = await transactionClient.measurements.create(operationDetails);
    } else {
        newMeasurement = await prisma.measurements.create(operationDetails);
    };
    return newMeasurement;
};

export async function createMeasurementService(measurementService, transactionClient) {
    const { measurementId, serviceId, requiredProgress } = measurementService;
    console.log("measurementIt: " + measurementId + ", serviceId: " + serviceId + ", requiredProgress: " + requiredProgress);
    const operationDetails = {
        data: {
            measurement_id: measurementId,
            service_id: serviceId,
            required_conclusion_percentage: requiredProgress
        },
    }
    let newMeasurementService;
    if(transactionClient) {
        newMeasurementService = await transactionClient.measurements_services.create(operationDetails);
    } else {
        newMeasurementService = await prisma.measurements_services.create(operationDetails);
    };
    return newMeasurementService;
};

export async function getServicesByWorkingSiteId(workingSiteId, transactionClient) {
    const operationDetails = {
        where: {
            working_site_id: workingSiteId
        }
    }
    let service;
    if(transactionClient) {
        service = await transactionClient.services.findMany(operationDetails);
    } else {
        service = await prisma.services.findMany(operationDetails);
    };
    return service;
};