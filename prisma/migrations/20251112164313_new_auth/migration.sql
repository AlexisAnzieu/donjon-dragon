/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unifiedId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `unifiedId` VARCHAR(191) NULL,
    MODIFY `pseudo` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_unifiedId_key` ON `User`(`unifiedId`);
