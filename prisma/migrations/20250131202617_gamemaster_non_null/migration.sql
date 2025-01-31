/*
  Warnings:

  - Made the column `gameMasterId` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_gameMasterId_fkey`;

-- AlterTable
ALTER TABLE `Game` MODIFY `gameMasterId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_gameMasterId_fkey` FOREIGN KEY (`gameMasterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
