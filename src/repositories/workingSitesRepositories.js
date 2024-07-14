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

export async function getWorkingSiteById(workingSiteId, transactionClient) {
    const operationDetails = {
        where: {
            id: workingSiteId
        },
        include: {
            services: true,
            measurements: {
                include: {
                    measurements_services: true
                }
            }
        },
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
    const { name, registrationNumber, addressId, estimatedStartDate, estimatedEndDate, isArchived = null } = workingSite;
    const operationDetails = {
        data: {
            name,
            registration_number: registrationNumber,
            address_id: addressId,
            estimated_start_date: estimatedStartDate,
            estimated_end_date: estimatedEndDate,
            is_archived: !!isArchived
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

export async function createIncome(incomeData, transactionClient) {
    const { name, workingSiteId, value, receivedAt } = incomeData;
    const operationDetails = {
        data: {
            name,
            working_site_id: workingSiteId,
            value,
            received_at: receivedAt,
        },
    }
    let newIncome;
    if(transactionClient) newIncome = await transactionClient.incomes.create(operationDetails);
    else newIncome = await prisma.incomes.create(operationDetails);
    return newIncome;
};

export async function createService(service, transactionClient) {
    const { name, incidence, estimatedCost, estimatedStartDate, estimatedEndDate, workingSiteId, approximateProgress = 0 } = service;
    const operationDetails = {
        data: {
            name,
            incidence,
            working_site_id: workingSiteId,
            estimated_cost: estimatedCost,
            estimated_start_date: estimatedStartDate,
            estimated_end_date: estimatedEndDate,
            approximate_progress: approximateProgress
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

export async function updateService(servideData, transactionClient) {
    const { id } = servideData;
    delete servideData.id;
    delete servideData.workingSiteId;
    const operationDetails = {
        where: { id: id },
        data: servideData,
    };
    if(transactionClient) {
        await transactionClient.services.update(operationDetails);
    } else {
        await prisma.services.update(operationDetails);
    };
    return;
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

export async function getWorkingSitesByStartDateAndIsArchived(startDate, isArchived, today) {
    const workingSitesList = await prisma.working_sites.findMany({
        where: {
            estimated_start_date: {
                gt: startDate,
            },
            is_archived: isArchived,
        },
        include: {
            measurements: {
                where: {
                    date: {
                        gt: today,
                    },
                },
            orderBy: {
                date: 'asc',
            },
            take: 1,
          },
        },
    });
    
    return workingSitesList;
};

export async function getWorkingSitesByStartDate(startDate, today) {
    const workingSitesList = await prisma.working_sites.findMany({
        where: {
            estimated_start_date: {
                gt: startDate,
            },
        },
        include: {
            measurements: {
                where: {
                    date: {
                        gt: today,
                    },
                },
            orderBy: {
                date: 'asc',
            },
            take: 1,
          },
        },
    });
    return workingSitesList;
};

export async function getWorkingSitesByIsArchived(isArchived, today) {
    const workingSitesList = await prisma.working_sites.findMany({
        where: {
            is_archived: isArchived,
        },
        include: {
            measurements: {
                where: {
                    date: {
                        gt: today,
                    },
                },
            orderBy: {
                date: 'asc',
            },
            take: 1,
          },
        },
    });
    return workingSitesList;
};

export async function getAllWorkingSites(today) {
    const workingSitesList = await prisma.working_sites.findMany({
        include: {
            measurements: {
                where: {
                    date: {
                        gt: today,
                    },
                },
                orderBy: {
                    date: 'asc',
                },
                take: 1,
            },
        },
    });
    return workingSitesList;
};

export async function getGoalsByMeasurementId(measurementId) {
    const goalsList = await prisma.measurements_services.findMany({
        where: {
            measurement_id: measurementId
        },
        include: {
            service: true,
        }
    });
    return goalsList;
}

/*
export async function getWorkingSiteById(id, transactionClient) {
    const operationDetails = {
        where: {
            id
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

export async function updateWorkingSiteById(newWorkingSite, transactionClient) {
    const { id, name, registrationNumber, addressId } = newWorkingSite;
    const operationDetails = {
        where: { id: id },
        data: {
            name,
            registration_number: registrationNumber,
            address_id: addressId
        },
    }
    if(transactionClient) {
        await transactionClient.working_sites.update(operationDetails);
    } else {
        await prisma.working_sites.update(operationDetails);
    }
    return;
};

export async function updateServiceById(newService, transactionClient) {
    const { id, name, incidence, estimatedCost, estimatedStartDate, estimatedEndDate, workingSiteId } = newService;
    const operationDetails = {
        where: { id: id },
        data: {
            name,
            incidence,
            working_site_id: workingSiteId,
            estimated_cost: estimatedCost,
            estimated_start_date: estimatedStartDate,
            estimated_end_date: estimatedEndDate
        },
    }
    if(transactionClient) {
        await transactionClient.services.update(operationDetails);
    } else {
        await prisma.services.update(operationDetails);
    };
    return;
}
    */