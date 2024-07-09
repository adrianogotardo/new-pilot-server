import pkg from "@prisma/client";
import dotenv from 'dotenv';

const { PrismaClient } = pkg;

dotenv.config();

const prismaClient = new PrismaClient();

export default prismaClient;