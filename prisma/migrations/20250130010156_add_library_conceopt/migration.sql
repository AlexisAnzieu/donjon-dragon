/*
  Warnings:

  - You are about to drop the `_GameToSoundLibrary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SessionToSound` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SessionToSoundLibrary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SoundLibraryToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SoundToSoundLibrary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_GameToSoundLibrary` DROP FOREIGN KEY `_GameToSoundLibrary_A_fkey`;

-- DropForeignKey
ALTER TABLE `_GameToSoundLibrary` DROP FOREIGN KEY `_GameToSoundLibrary_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SessionToSound` DROP FOREIGN KEY `_SessionToSound_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SessionToSound` DROP FOREIGN KEY `_SessionToSound_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SessionToSoundLibrary` DROP FOREIGN KEY `_SessionToSoundLibrary_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SessionToSoundLibrary` DROP FOREIGN KEY `_SessionToSoundLibrary_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SoundLibraryToUser` DROP FOREIGN KEY `_SoundLibraryToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SoundLibraryToUser` DROP FOREIGN KEY `_SoundLibraryToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SoundToSoundLibrary` DROP FOREIGN KEY `_SoundToSoundLibrary_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SoundToSoundLibrary` DROP FOREIGN KEY `_SoundToSoundLibrary_B_fkey`;

-- AlterTable
ALTER TABLE `Sound` ADD COLUMN `soundLibraryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SoundLibrary` ADD COLUMN `gameId` VARCHAR(191) NULL,
    ADD COLUMN `sessionId` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_GameToSoundLibrary`;

-- DropTable
DROP TABLE `_SessionToSound`;

-- DropTable
DROP TABLE `_SessionToSoundLibrary`;

-- DropTable
DROP TABLE `_SoundLibraryToUser`;

-- DropTable
DROP TABLE `_SoundToSoundLibrary`;

-- AddForeignKey
ALTER TABLE `SoundLibrary` ADD CONSTRAINT `SoundLibrary_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SoundLibrary` ADD CONSTRAINT `SoundLibrary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SoundLibrary` ADD CONSTRAINT `SoundLibrary_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sound` ADD CONSTRAINT `Sound_soundLibraryId_fkey` FOREIGN KEY (`soundLibraryId`) REFERENCES `SoundLibrary`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
