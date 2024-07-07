/*
  Warnings:

  - You are about to drop the column `servide_id` on the `measurements_services` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `measurements_services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "measurements_services" DROP CONSTRAINT "measurements_services_servide_id_fkey";

-- AlterTable
ALTER TABLE "measurements_services" DROP COLUMN "servide_id",
ADD COLUMN     "service_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "cancelled_at" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "measurements_services" ADD CONSTRAINT "measurements_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
