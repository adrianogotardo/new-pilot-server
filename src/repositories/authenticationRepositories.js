import prisma from "../database.js";

export async function getUserByEmail(email) {
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
        include: {
            role: true,
        }
    });
    return user;
};

export async function getIdOfSpecificRole(roleName) {
    const role = await prisma.roles.findUnique({
        where: {
            name: roleName,
        }
    });
    return role.id;
};

export async function createUser(name, email, password, roleId) {
    await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: password,
          role_id: roleId
        },
    });
    return;
};