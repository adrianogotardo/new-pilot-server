import app from "../../src/app";
import request from "supertest";

export async function createBasicUser(user) {
    await request(app).post('/sign/up').send(user);
    return;
};