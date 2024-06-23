import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function roleSeeder() {
    console.log("> Initiating roles seed...");
    
    const standardRoles = ["new" , "basic", "root", "admin"];
    const existentRoles = await prisma.roles.findMany({});

    function findMissingRoles(standardRoles, existentRoles) {
        existentRoles.forEach((existentRole) => {
            standardRoles = standardRoles.filter((standardRoleName) =>  {
                return standardRoleName !== existentRole.name;
            });
        });

        let missingRoles = [...standardRoles];
        return missingRoles;
    };

    const missingRoles = findMissingRoles(standardRoles, existentRoles);

    if(missingRoles.length > 0) {
        console.log(">> Creating Roles... ");

        const rolesSeeded = await prisma.roles.createMany({
            data: missingRoles.map(role => ({name: role}))
        });

        console.log(">>CREATED: ");
        console.log("");
        console.log(rolesSeeded);
    } else {
        console.log(">> Roles already registered, skipping this step...");
    }
};

async function main() {
    await roleSeeder();
};

main().catch((e) => {
    console.error(e.message);
}).finally(async () => {
    await prisma.$disconnect();
});