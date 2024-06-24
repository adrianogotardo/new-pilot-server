import prisma from "../database.js";

export async function getUserByEmail(email) {
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    
    return user;
};

export async function createUser(name, email, password) {
    await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: password
        },
    });

    return;
};