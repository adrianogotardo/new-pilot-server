import { getIdOfSpecificRole } from "../../src/repositories/authenticationRepositories.js";

export async function changeUserRole(userEmail, roleName, prisma){
    const idOfRootRole = await getIdOfSpecificRole(roleName);
    await prisma.$queryRawUnsafe(`UPDATE users SET "role_id" = ${idOfRootRole} WHERE email = '${userEmail}';`);
};