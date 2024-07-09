import request from 'supertest';
import app from '../src/app.js';
import prisma from "../src/database.js";
import { roleSeeder } from "../src/utils/roleSeeder.js";
import { createBasicUser } from "./utils/createBasicUser.js";
import { changeUserRole } from "./utils/changeUserRole.js";
import { logInUser } from "./utils/logInUser.js";

async function clearDatabase() {
    const models = ['users', 'roles', 'employees_attendances', 'paychecks', 'loans', 'employees', 'incomes', 'measurements_services',  'ordered_items', 'services', 'measurements', 'orders', 'working_sites', 'stores', 'addresses'];
    for (const model of models) {
      await prisma[`${model}`].deleteMany({});
    };
};

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

const timeZone = 'America/Sao_Paulo';
const stardDate = encodeURIComponent('2024-01-01T00:00:00+03:00');
const endDate = encodeURIComponent('2024-12-31T23:59:59+03:00');
const invalidDate = encodeURIComponent('2024-13-32T24:60:60+15:00');

let rootUser = {
    name: "Testarino",
    email: "testarino@email.com",
    password: "superpassword"
};

let basicUser = {
    name: "Testilhana",
    email: "testilhana@email.com",
    password: "superpassword"
}

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
    await clearDatabase();
    await roleSeeder(prisma);
    await createRootUserToken();
    await createBasicUserToken();
});

describe('POST/employee', () => {

    it('should get status 401 for headers missing an authorization token', async () => {
        const res = await request(app)
            .post('/employee')
            .set({ 'time-zone': `${timeZone}` })
            .send(newEmployeeCorrectBody);
        const responseText = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${malformedToken}`, 'time-zone': `${timeZone}` })
            .send(newEmployeeCorrectBody);
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${basicUser.token}`, 'time-zone': `${timeZone}` })
            .send(newEmployeeCorrectBody);
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for headers missing a time-zone', async () => {
        const res = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployeeCorrectBody);
        const responsetext = "The request is missing the time zone header";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 422 for incorrect body', async () => {
        let newEmployeeIncorrectBody = { ...newEmployeeCorrectBody };
        delete newEmployeeIncorrectBody.name;
        const res = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newEmployeeIncorrectBody);
        const responseText = '"name" is required';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 201 for success', async () => {
        const res = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newEmployeeCorrectBody);
        expect(res.statusCode).toEqual(201);
    });

    it('should get status 409 for conflict', async () => {
        const res = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send(newEmployeeCorrectBody);
        const responseText = "Document number is already registered";
        expect(res.statusCode).toEqual(409);
        expect(res.text).toEqual(responseText);
    });

});

describe('GET/employee/all', () => {

    it('should get status 401 for headers missing authorization token', async () => {
        const res = await request(app)
            .get('/employee/all')
            .set({ 'time-zone': `${timeZone}` });
        const responsetext = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .get('/employee/all')
            .set({ 'Authorization': `Bearer ${malformedToken}`, 'time-zone': `${timeZone}` });
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .get('/employee/all')
            .set({ 'Authorization': `Bearer ${basicUser.token}`, 'time-zone': `${timeZone}` });
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for headers missing a time-zone', async () => {
        const res = await request(app)
            .get('/employee/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responsetext = "The request is missing the time zone header";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 200 and a list of all employees (1 item)', async () => {
        const res = await request(app)
            .get('/employee/all')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

});

describe('GET/employee/all?startDate&endDate', () => {

    it('should get status 422 for incomplete date range', async () => {
        const res = await request(app)
            .get(`/employee/all?startDate=${stardDate}`)
            .set('Authorization', `Bearer ${rootUser.token}`)
            .set('time-zone', `${timeZone}`);
        const responsetext = "Date range is incomplete";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 422 for invalid date', async () => {
        const res = await request(app)
            .get(`/employee/all?startDate=${invalidDate}&endDate=${invalidDate}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const responsetext = 'Invalid date. Please make sure all date values follow the ISO 8601 format ("YYYY-MM-DDTHH:mm:ssZ")';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 200 and a list of all employees filtered by date (3 items', async () => {
        await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Saldanha Lasanha", documentNumber: "12345678912" });
        await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Carol Caracol", documentNumber: "12345678913" });
        const res = await request(app)
            .get(`/employee/all?startDate=${stardDate}&endDate=${endDate}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(3);
    });

});

describe('GET/employee/all?isActive', () => {

    it('should get status 422 for invalid "isActive" value', async () => {
        const res = await request(app)
            .get(`/employee/all?isActive=banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        const responsetext = 'Invalid "isActive" value. Please make sure that it is "true" or "false"';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 200 and a list of all employees filtered by active status (1 item with "isActive=false")', async () => {
        await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Júlio Entulho", documentNumber: "12345678914", isActive: "false" });
        const res = await request(app)
            .get(`/employee/all?isActive=false`)
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
    });

});

describe('PUT/employee/:id', () => {

    it('should get status 401 for headers missing authorization token', async () => {
        const res = await request(app)
            .put(`/employee/1`)
            .send(newEmployeeCorrectBody);
        const responsetext = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .put(`/employee/1`)
            .set({ 'Authorization': `Bearer ${malformedToken}` })
            .send(newEmployeeCorrectBody);
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .put(`/employee/1`)
            .set({ 'Authorization': `Bearer ${basicUser.token}` })
            .send(newEmployeeCorrectBody);
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for invalid employee id', async () => {
        const res = await request(app)
            .put(`/employee/banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployeeCorrectBody);
        const responseText = "Invalid employee id";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for incompatible body', async () => {
        let newEmployeeIncorrectBody = { ...newEmployeeCorrectBody };
        delete newEmployeeIncorrectBody.name;
        const res = await request(app)
            .put(`/employee/1`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployeeIncorrectBody);
        const responseText = '"name" is required';
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 404 for user not found', async () => {
        const res = await request(app)
            .put(`/employee/1`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployeeCorrectBody);
        const responseText = "Employee not found";
        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 409 for conflict (document number belongs to another employee)', async () => {
        const newEmployeeRequest = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Natasha Bolacha", documentNumber: "12345678915" });

        const newEmployee = { 
            ...newEmployeeRequest.body,
            wage: +newEmployeeRequest.body.wage,
            phone: +newEmployeeRequest.body.phone,
            address: {
                ...newEmployeeRequest.body.address,
                postalCode: +newEmployeeRequest.body.address.postalCode,
            } 
        };
        const { id } = newEmployee;
        delete newEmployee.addressId;
        delete newEmployee.isActive;
        delete newEmployee.hiredAt;
        delete newEmployee.id;

        const res = await request(app)
            .put(`/employee/${id}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployeeCorrectBody);
        const responseText = "Document number belongs to another employee";
        expect(res.statusCode).toEqual(409);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 200 for success', async () => {
        const newEmployeeRequest = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Caio Balaio", documentNumber: "12345678916" });

        const newEmployee = { 
            ...newEmployeeRequest.body,
            wage: +newEmployeeRequest.body.wage,
            phone: +newEmployeeRequest.body.phone,
            address: {
                ...newEmployeeRequest.body.address,
                postalCode: +newEmployeeRequest.body.address.postalCode,
            }
        };
        const { id } = newEmployee;
        delete newEmployee.addressId;
        delete newEmployee.isActive;
        delete newEmployee.hiredAt;
        delete newEmployee.id;

        const res = await request(app)
            .put(`/employee/${id}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployee);
        expect(res.statusCode).toEqual(200);
    });

});

describe('PUT/employee/reactivate/:id', () => {

    it('should get status 401 for headers missing authorization token', async () => {
        const res = await request(app)
            .put(`/employee/reactivate/1`);
        const responsetext = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .put(`/employee/reactivate/1`)
            .set({ 'Authorization': `Bearer ${malformedToken}` });
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .put(`/employee/reactivate/1`)
            .set({ 'Authorization': `Bearer ${basicUser.token}` });
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for invalid employee id', async () => {
        const res = await request(app)
            .put(`/employee/reactivate/banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responseText = "Invalid employee id";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 404 for user not found', async () => {
        const res = await request(app)
            .put(`/employee/reactivate/1`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responseText = "Employee not found";
        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 406 for user already active', async () => {
        const newEmployeeRequest = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Fatinha Farinha", documentNumber: "12345678917" });      
        const newEmployee = { 
            ...newEmployeeRequest.body,
            wage: +newEmployeeRequest.body.wage,
            phone: +newEmployeeRequest.body.phone,
            address: {
                ...newEmployeeRequest.body.address,
                postalCode: +newEmployeeRequest.body.address.postalCode,
            }
        };
        const { id } = newEmployee;
        delete newEmployee.addressId;
        delete newEmployee.isActive;
        delete newEmployee.hiredAt;
        delete newEmployee.id;

        const res = await request(app)
            .put(`/employee/reactivate/${id}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployee);
        const responseText = "The employee already is active";
        expect(res.statusCode).toEqual(406);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 200 for success', async () => {
        const newEmployeeRequest = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Jandira Caipira", documentNumber: "12345678918", isActive: "false" });

        const newEmployee = { 
            ...newEmployeeRequest.body,
            wage: +newEmployeeRequest.body.wage,
            phone: +newEmployeeRequest.body.phone,
            address: {
                ...newEmployeeRequest.body.address,
                postalCode: +newEmployeeRequest.body.address.postalCode,
            }
        };
        const { id } = newEmployee;
        delete newEmployee.addressId;
        delete newEmployee.isActive;
        delete newEmployee.hiredAt;
        delete newEmployee.id;

        const res = await request(app)
            .put(`/employee/reactivate/${id}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` })
            .send(newEmployee);
        expect(res.statusCode).toEqual(200);
    });

});

describe('DELETE/employee/:id', () => {

    it('should get status 401 for headers missing authorization token', async () => {
        const res = await request(app)
            .delete(`/employee/1`);
        const responsetext = "The request is missing the authorization header";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responsetext);
    });

    it('should get status 401 for authorization token being malformed', async () => {
        const malformedToken = rootUser.token.replace(/\./g, '');
        const res = await request(app)
            .delete(`/employee/1`)
            .set({ 'Authorization': `Bearer ${malformedToken}` });
        const responseText = "The provided token doesn't have three components (delimited by a '.')";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 401 for user not having permission to complete this operation', async () => {
        const res = await request(app)
            .delete(`/employee/1`)
            .set({ 'Authorization': `Bearer ${basicUser.token}` });
        const responseText = "The user lacks permission to perform this operation";
        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 422 for invalid employee id', async () => {
        const res = await request(app)
            .delete(`/employee/banana`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responseText = "Invalid employee id";
        expect(res.statusCode).toEqual(422);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 404 for user not found', async () => {
        const res = await request(app)
            .delete(`/employee/1`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responseText = "Employee not found";
        expect(res.statusCode).toEqual(404);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 406 for user already inactive', async () => {
        const newEmployeeRequest = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Luciano Cano", documentNumber: "12345678919", isActive: 'false' });

        const newEmployee = { 
            ...newEmployeeRequest.body,
            wage: +newEmployeeRequest.body.wage,
            phone: +newEmployeeRequest.body.phone,
            address: {
                ...newEmployeeRequest.body.address,
                postalCode: +newEmployeeRequest.body.address.postalCode,
            }
        };
        const { id } = newEmployee;
        delete newEmployee.addressId;
        delete newEmployee.isActive;
        delete newEmployee.hiredAt;
        delete newEmployee.id;

        const res = await request(app)
            .delete(`/employee/${id}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        const responseText = "The employee already is inactive";
        expect(res.statusCode).toEqual(406);
        expect(res.text).toEqual(responseText);
    });

    it('should get status 200 for success', async () => {
        const newEmployeeRequest = await request(app)
            .post('/employee')
            .set({ 'Authorization': `Bearer ${rootUser.token}`, 'time-zone': `${timeZone}` })
            .send({ ...newEmployeeCorrectBody, name: "Arnaldo Caldo", documentNumber: "12345678920" });

        const newEmployee = { 
            ...newEmployeeRequest.body,
            wage: +newEmployeeRequest.body.wage,
            phone: +newEmployeeRequest.body.phone,
            address: {
                ...newEmployeeRequest.body.address,
                postalCode: +newEmployeeRequest.body.address.postalCode,
            }
        };
        const { id } = newEmployee;
        delete newEmployee.addressId;
        delete newEmployee.isActive;
        delete newEmployee.hiredAt;
        delete newEmployee.id;
        

        const res = await request(app)
            .delete(`/employee/${id}`)
            .set({ 'Authorization': `Bearer ${rootUser.token}` });
        expect(res.statusCode).toEqual(200);
    });

});

afterAll(async () => {
    await clearDatabase();
    await prisma.$disconnect();
});
  