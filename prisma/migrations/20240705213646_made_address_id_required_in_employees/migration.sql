/*
  Warnings:

  - Made the column `address_id` on table `employees` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_address_id_fkey";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "address_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
