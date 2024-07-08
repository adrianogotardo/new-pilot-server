import { getOrders } from "../services/ordersServices.js";

export async function getOrdersList(req, res) {
    const { startDate = null, endDate = null, storeId = null, workingSiteId = null } = req.query;
    const timeZone = req.headers['time-zone'];
    if(!!startDate !== !!endDate) throw {
        type: 'unprocessable entity',
        message: 'Date range is incomplete'
    };
    const ordersList = await getOrders(startDate, endDate, storeId, workingSiteId, timeZone);
    return res.status(200).send(ordersList);
};

export async function getOneOrder(req, res) {
    return res.sendStatus(200);
}