import request from 'supertest';
import app from '../src/app.js';
import prisma from "../src/database.js";
import moment from "moment-timezone";
import { clearDatabase } from './utils/clearDatabase.js';
import { roleSeeder } from "../src/utils/roleSeeder.js";
import { createBasicUser } from "./utils/createBasicUser.js";
import { changeUserRole } from "./utils/changeUserRole.js";
import { logInUser } from "./utils/logInUser.js";

const timeZone = 'America/Sao_Paulo';
const invalidDate = encodeURIComponent('2024-13-32T24:60:60+15:00');

const addressExample = {
    street: "Flowers Street",
    number: "Bloco A",
    complement: "Yellow gate",
    neighbourhood: "Centro",
    city: "Santos",
    state: "São Paulo",
    postalCode: 12345678
};

let newWorkingSiteCorrectBody = {
    name: "Obra 01",
    registrationNumber: 12345678910,
    estimatedStartDate: '2024-06-01T00:00:00-03:00',
    estimatedEndDate: '2024-06-30T23:59:59-03:00',
    address: addressExample,
    services: [
        {
            name: "Serviço 01",
            incidence: 4000,
            estimatedCost: 1000000,
            estimatedStartDate: '2024-06-01T00:00:00-03:00',
            estimatedEndDate: '2024-06-15T23:59:59-03:00'
        },
        {
            name: "Serviço 02",
            incidence: 6000,
            estimatedCost: 1500000,
            estimatedStartDate: '2024-06-16T00:00:00-03:00',
            estimatedEndDate: '2024-06-30T23:59:59-03:00'
        }
    ],
    measurements: [
        {
            date: "2024-06-01T00:00:00-03:00",
            services: [
                { name: "Serviço 01", requiredProgress: 7000 }
            ]
        },
        {
            date: "2024-06-20T00:00:00-03:00",
            services: [
                { name: "Serviço 01", requiredProgress: 10000 },
                { name: "Serviço 02", requiredProgress: 5000 }
            ]
        },
        {
            date: "2024-06-30T00:00:00-03:00",
            services: [
                { name: "Serviço 02", requiredProgress: 10000 }
            ]
        }
    ]
};

const futureStartDate = moment.tz(timeZone).add(2, 'days').format('YYYY-MM-DDTHH:mm:ssZ');
const futureEndDate = moment.tz(timeZone).add(62, 'days').format('YYYY-MM-DDTHH:mm:ssZ');

let newFutureWorkingSiteCorrectBody = { 
    name: "Obra 02", 
    registrationNumber: 12345678911,
    estimatedStartDate: futureStartDate,
    estimatedEndDate: futureEndDate,
    address: addressExample,
    services: [
        {
            name: "Serviço 01",
            incidence: 3000,
            estimatedCost: 1000000,
            estimatedStartDate: futureStartDate,
            estimatedEndDate: moment.tz(timeZone).add(22, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
            approximateProgress: 6000
        },
        {
            name: "Serviço 02",
            incidence: 3000,
            estimatedCost: 1500000,
            estimatedStartDate: moment.tz(timeZone).add(23, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
            estimatedEndDate: moment.tz(timeZone).add(42, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
            approximateProgress: 1000
        },
        {
            name: "Serviço 03",
            incidence: 4000,
            estimatedCost: 1000000,
            estimatedStartDate: moment.tz(timeZone).add(43, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
            estimatedEndDate: futureEndDate,
        }
    ],
    measurements: [
        {
            date: moment.tz(timeZone).add(22, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
            services: [
                { name: "Serviço 01", requiredProgress: 10000 },
                { name: "Serviço 02", requiredProgress: 2000 }
            ]
        },
        {
            date: moment.tz(timeZone).add(38, 'days').format('YYYY-MM-DDTHH:mm:ssZ'),
            services: [
                { name: "Serviço 02", requiredProgress: 7000 },
                { name: "Serviço 03", requiredProgress: 2000 }
            ]
        },
        {
            date: futureEndDate,
            services: [
                { name: "Serviço 02", requiredProgress: 10000 },
                { name: "Serviço 03", requiredProgress: 10000 }
            ]
        }
    ]
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

describe('POST/site', () => {

    it('should get status 401 for headers missing an authorization token', async () => {
        const res = await request(app)
            .post('/site')
            .set({ 'time-zone': `${timeZone}` })
            .send(newWorkingSiteCorrectBody);
        const responseText = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${malformedToken}`, 'time-zone': `${timeZone}` })
            .send(newWorkingSiteCorrectBody);
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${basicUser.token}`, 'time-zone': `${timeZone}` })
            .send(newWorkingSiteCorrectBody);
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for incorrect body', async () => {
        let newWorkingSiteIncorrectBody = { ...newWorkingSiteCorrectBody };
        delete newWorkingSiteIncorrectBody.registrationNumber;
        const res = await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newWorkingSiteIncorrectBody);
        const responseText = '"registrationNumber" is required';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 201 for success', async () => {
        const res = await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newWorkingSiteCorrectBody);
        expect(res.statusCode).toEqual(201);
    });

    it('should get status 409 for conflict', async () => {
        const res = await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newWorkingSiteCorrectBody);
        const responseText = "Registration number is already in use";
        expect(res.statusCode).toEqual(409);
        expect(res.text).toEqual(responseText);
    });

});

describe('POST/site/income', () => {

    it('should get status 401 for headers missing an authorization token', async () => {
        const workingSitesList = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const workingSiteid = workingSitesList.body[0].id;
        const res = await request(app)
            .post('/site/income')
            .set({ 'time-zone': `${timeZone}` })
            .send({ name: 'Pagamento Caixa 1/6', workingSiteId: workingSiteid, value: 5000000 });
        const responseText = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const workingSitesList = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const workingSiteid = workingSitesList.body[0].id;
        const res = await request(app)
            .post('/site/income')
            .set({ 'Authorization': `Bearer ${malformedToken}`, 'time-zone': `${timeZone}` })
            .send({ name: 'Pagamento Caixa 1/6', workingSiteId: workingSiteid, value: 5000000 });
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const workingSitesList = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const workingSiteid = workingSitesList.body[0].id;
        const res = await request(app)
            .post('/site/income')
            .set({ 'Authorization': `Bearer ${basicUser.token}`, 'time-zone': `${timeZone}` })
            .send({ name: 'Pagamento Caixa 1/6', workingSiteId: workingSiteid, value: 5000000 });
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for incorrect body', async () => {
        const workingSitesList = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const workingSiteid = workingSitesList.body[0].id;
        const res = await request(app)
            .post('/site/income')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ name: 'Pagamento Caixa 1/6', workingSiteId: workingSiteid });
        const responseText = '"value" is required';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 201 for success', async () => {
        const workingSitesList = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const workingSiteid = workingSitesList.body[0].id;
        const res = await request(app)
            .post('/site/income')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ name: 'Pagamento Caixa 1/6', workingSiteId: workingSiteid, value: 5000000 });
        console.log(res.text);
        expect(res.statusCode).toEqual(201);
    });
});

describe('GET/site/all', () => {

    it('should get status 401 for headers missing authorization token', async () => {
        const res = await request(app)
            .get('/site/all')
            .set({ 'time-zone': `${timeZone}` });
        const responsetext = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${malformedToken}`, 'time-zone': `${timeZone}` });
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${basicUser.token}`, 'time-zone': `${timeZone}` });
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for headers missing a time-zone', async () => {
        const res = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responsetext = "The request is missing the time zone header";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 200 and a list of all working sites (1 item)', async () => {
        const res = await request(app)
            .get('/site/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

});

describe('GET/site/all?startDate', () => {

    it('should get status 422 for invalid startDate value', async () => {
        const res = await request(app)
            .get(`/site/all?startDate=${invalidDate}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const responsetext = 'Invalid date. Please make sure startDate value follow the ISO 8601 format ("YYYY-MM-DDTHH:mm:ssZ")';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 200 and a list of all working sites filtered by startDate (1 item)', async () => {       
        await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newFutureWorkingSiteCorrectBody);
        const res = await request(app)
            .get(`/site/all?startDate=${moment.tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ')}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

});

describe('GET/site/all?isArchived', () => {

    it('should get status 422 for invalid isArchived value', async () => {
        const res = await request(app)
            .get(`/site/all?isArchived=banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const responsetext = 'Invalid "isArchived" value. Please make sure that it is "true" or "false"';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 200 and a list of all working sites filtered by isArchived (1 item)', async () => {
        let newArchivedWorkingSiteCorrectBody = { 
            ...newWorkingSiteCorrectBody, 
            name: "Obra 03", 
            registrationNumber: 12345678912,
            isArchived: true,
        };
        await request(app)
            .post('/site')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newArchivedWorkingSiteCorrectBody);
        const res = await request(app)
            .get(`/site/all?isArchived=true`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

});

afterAll(async () => {
    await clearDatabase(prisma);
    await prisma.$disconnect();
});
