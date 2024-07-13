/*
  Warnings:

  - You are about to drop the column `started_at` on the `working_sites` table. All the data in the column will be lost.
  - Added the required column `estimated_end_date` to the `working_sites` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimated_start_date` to the `working_sites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "working_sites" DROP COLUMN "started_at",
ADD COLUMN     "estimated_end_date" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "estimated_start_date" TIMESTAMPTZ(6) NOT NULL;
