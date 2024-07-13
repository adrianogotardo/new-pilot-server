export async function clearDatabase(prisma) {
    const models = ['users', 'roles', 'employees_attendances', 'paychecks', 'loans', 'employees', 'incomes', 'measurements_services',  'ordered_items', 'services', 'measurements', 'orders', 'working_sites', 'stores', 'addresses'];
    for (const model of models) {
      await prisma[`${model}`].deleteMany({});
    };
};