import { PrismaClient } from "@prisma/client";
import { roleSeeder } from "../src/utils/roleSeeder.js"

const prisma = new PrismaClient();

await roleSeeder(prisma);