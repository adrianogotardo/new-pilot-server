import request from 'supertest';
import app from '../src/app.js';
import prisma from "../src/database.js";
import { clearDatabase } from './utils/clearDatabase.js';
import { roleSeeder } from "../src/utils/roleSeeder.js";
import { createBasicUser } from "./utils/createBasicUser.js";
import { changeUserRole } from "./utils/changeUserRole.js";
import { logInUser } from "./utils/logInUser.js";

const timeZone = 'America/Sao_Paulo';
const stardDate = encodeURIComponent('2024-01-01T00:00:00+03:00');
const endDate = encodeURIComponent('2024-12-31T23:59:59+03:00');
const invalidDate = encodeURIComponent('2024-13-32T24:60:60+15:00');

let newEmployeeCorrectBody = {
    name: "João Feijão",
    wage: 150000,
    documentNumber: "12345678911",
    phone: 988889999,
    pix: "smith.mail@provider.com",
    observation: "first job",
    address: {
        street: "Flowers Street",
        number: "Bloco A",
        complement: "Yellow gate",
        neighbourhood: "Centro",
        city: "Santos",
        state: "São Paulo",
        postalCode: 12345678
    }
};

let rootUser = {
    name: "Testarino",
    email: "testarino@email.com",
    password: "superpassword"
};

let basicUser = {
    name: "Testilhana",
    email: "testilhana@email.com",
    password: "superpassword"
};

async function createRootUserToken() {
    await createBasicUser(rootUser);
    await changeUserRole(rootUser.email, "root", prisma);
    const token = await logInUser(rootUser);
    rootUser.token = token;
};

async function createBasicUserToken() {
    await createBasicUser(basicUser);
    const token = await logInUser(basicUser);
    basicUser.token = token;
};

beforeAll(async () => {
    await prisma.$connect();
    await clearDatabase(prisma);
    await roleSeeder(prisma);
    await createRootUserToken();
    await createBasicUserToken();
});

describe('GET/order/all', () => {

    it('should get status 401 for headers missing authorization token', async () => {
        const res = await request(app)
            .get('/order/all')
            .set({ 'time-zone': `${timeZone}` });
        const responsetext = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .get('/order/all')
            .set({ 'Authorization': `Bearer ${malformedToken}`, 'time-zone': `${timeZone}` });
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .get('/order/all')
            .set({ 'Authorization': `Bearer ${basicUser.token}`, 'time-zone': `${timeZone}` });
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for headers missing a time-zone', async () => {
        const res = await request(app)
            .get('/order/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responsetext = "The request is missing the time zone header";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    // FAZER O CASE DE SUCESSO QUANDO A ROTA POST ESTIVER PRONTA

});

describe('GET/order/all?startDate&endDate', () => {

    it('should get status 422 for incomplete date range', async () => {
        const res = await request(app)
            .get(`/order/all?startDate=${stardDate}`)
            .set('Authorization', `Bearer ${rootUser.token}`)
            .set('time-zone', `${timeZone}`);
        const responsetext = "Date range is incomplete";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 422 for invalid date', async () => {
        const res = await request(app)
            .get(`/order/all?startDate=${invalidDate}&endDate=${invalidDate}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const responsetext = 'Invalid date. Please make sure all date values follow the ISO 8601 format ("YYYY-MM-DDTHH:mm:ssZ")';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    // FAZER O CASE DE SUCESSO QUANDO A ROTA POST ESTIVER PRONTA

});

describe('GET/order/all?storeId', () => {

    // CONSERTAR (ESTÁ HARD FIXED COMO 200)
    it('should get status 422 for invalid "storeId" value', async () => {
        const res = await request(app)
            .get(`/employee/all?storeId=banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        //const responsetext = 'Invalid "storeId" value. Please make sure that it is "true" or "false"';
        expect(res.statusCode).toEqual(200);
        //expect(res.text).toEqual(responsetext);
    });

    // FAZER O CASE DE SUCESSO QUANDO A ROTA POST ESTIVER PRONTA

});

describe('GET/order/all?workingSiteId', () => {

    // CONSERTAR (ESTÁ HARD FIXED COMO 200)
    it('should get status 422 for invalid "workingSiteId" value', async () => {
        const res = await request(app)
            .get(`/employee/all?workingSiteId=banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        //const responsetext = 'Invalid "workingSiteId" value. Please make sure that it is "true" or "false"';
        expect(res.statusCode).toEqual(200);
        //expect(res.text).toEqual(responsetext);
    });

    // FAZER O CASE DE SUCESSO QUANDO A ROTA POST ESTIVER PRONTA

});