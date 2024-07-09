import app from "../../src/app";
import request from "supertest";

export async function logInUser(user) {
    const response = await request(app).post('/sign/in').send({ email: user.email, password: user.password });
    return response.text;
};