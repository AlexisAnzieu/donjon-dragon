/*
  Warnings:

  - Made the column `soundLibraryId` on table `Sound` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Sound` DROP FOREIGN KEY `Sound_soundLibraryId_fkey`;

-- AlterTable
ALTER TABLE `Sound` MODIFY `soundLibraryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Sound` ADD CONSTRAINT `Sound_soundLibraryId_fkey` FOREIGN KEY (`soundLibraryId`) REFERENCES `SoundLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
