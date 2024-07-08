import { getOrdersByCustomQuery } from "../repositories/ordersRepositories.js";
import { dateRangeFormatter } from "../utils/dateRangeFormatter.js";

export async function getOrders(startDate, endDate, storeId, workingSiteId, timeZone) {
    let dbQuery = `SELECT o.id, o.name, o.working_site_id AS "workingSiteId", o.store_id AS "storeId", o.created_at AT TIME ZONE 'UTC' AT TIME ZONE '${timeZone}' AS "createdAt", o.value, o.negotiated_value AS "negotiatedValue", o.cash_value AS "cashValue", o.financed_value AS "financedValue", o.observation, i.id, i.name, i.value, i.service_id AS "serviceId" FROM orders o LEFT JOIN ordered_items i ON i.order_id = o.id`;
    if((startDate && endDate) || storeId || workingSiteId) {
        dbQuery += ' WHERE';
        if(startDate && endDate) {
            startDate = dateRangeFormatter(startDate, 'start');
            endDate = dateRangeFormatter(endDate, 'end');
            dbQuery += ` created_at BETWEEN TIMESTAMP WITH TIME ZONE '${startDate}' AND TIMESTAMP WITH TIME ZONE '${endDate}'`;

            if(storeId) dbQuery += ` AND store_id = '${storeId}`;
            if(workingSiteId) dbQuery += ` AND working_site_id = '${workingSiteId}`;
        };
        if(storeId) {
            dbQuery += ` store_id = '${storeId}`;
            if(workingSiteId) dbQuery += ` AND working_site_id = '${workingSiteId}`;
        };
        if(workingSiteId) {
            dbQuery += ` working_site_id = '${workingSiteId}`;
        };
    };
    dbQuery+= ';';

    const ordersList = await getOrdersByCustomQuery(dbQuery);

    let ordersListWithBigIntAsString = null;
    if(ordersList) {
        ordersListWithBigIntAsString = ordersList.map(order => ({
            ...order,
            value: order.value.toString(),
            negotiatedValue: order.negotiatedValue?.toString(),
            cashValue: order.cashValue.toString(),
            financedValue: order.financedValue.toString()
        }));
    };
    return ordersListWithBigIntAsString;
};