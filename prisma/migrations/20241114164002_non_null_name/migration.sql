/*
  Warnings:

  - Made the column `name` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Character` MODIFY `name` VARCHAR(191) NOT NULL;
