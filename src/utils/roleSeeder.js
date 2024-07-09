export async function roleSeeder(prisma) {
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
        await prisma.roles.createMany({
            data: missingRoles.map(role => ({name: role}))
        });
    };
};