import { isValidDateString } from "../utils/isValidDateString.js";
import { getOrders } from "../services/ordersServices.js";

export async function getOrdersList(req, res) {
    const { startDate = null, endDate = null, storeId = null, workingSiteId = null } = req.query;
    const timeZone = req.headers['time-zone'];
    if(!!startDate !== !!endDate) throw {
        type: 'unprocessable entity',
        message: 'Date range is incomplete'
    };
    if((startDate && endDate) && (!isValidDateString(startDate) || !isValidDateString(endDate))) throw {
        type: 'unprocessable entity',
        message: 'Invalid date. Please make sure all date values follow the ISO 8601 format ("YYYY-MM-DDTHH:mm:ssZ")'
    };
    const ordersList = await getOrders(startDate, endDate, storeId, workingSiteId, timeZone);
    return res.status(200).send(ordersList);
};