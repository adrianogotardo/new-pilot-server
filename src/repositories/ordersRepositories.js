import prisma from "../database.js";

export async function getOrdersByCustomQuery(dbQuery) {
    const ordersList = await prisma.$queryRawUnsafe(dbQuery);
    return ordersList;
};