/*
  Warnings:

  - Added the required column `started_at` to the `working_sites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "working_sites" ADD COLUMN     "started_at" TIMESTAMPTZ(6) NOT NULL;
