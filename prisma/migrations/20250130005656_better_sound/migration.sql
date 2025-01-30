/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Sound` table. All the data in the column will be lost.
  - You are about to drop the column `soundLibraryId` on the `Sound` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `SoundLibrary` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `SoundLibrary` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SoundLibrary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Sound` DROP FOREIGN KEY `Sound_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `Sound` DROP FOREIGN KEY `Sound_soundLibraryId_fkey`;

-- DropForeignKey
ALTER TABLE `SoundLibrary` DROP FOREIGN KEY `SoundLibrary_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `SoundLibrary` DROP FOREIGN KEY `SoundLibrary_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `SoundLibrary` DROP FOREIGN KEY `SoundLibrary_userId_fkey`;

-- AlterTable
ALTER TABLE `Sound` DROP COLUMN `sessionId`,
    DROP COLUMN `soundLibraryId`;

-- AlterTable
ALTER TABLE `SoundLibrary` DROP COLUMN `gameId`,
    DROP COLUMN `sessionId`,
    DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `_GameToSoundLibrary` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_GameToSoundLibrary_AB_unique`(`A`, `B`),
    INDEX `_GameToSoundLibrary_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SessionToSoundLibrary` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SessionToSoundLibrary_AB_unique`(`A`, `B`),
    INDEX `_SessionToSoundLibrary_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SessionToSound` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SessionToSound_AB_unique`(`A`, `B`),
    INDEX `_SessionToSound_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SoundLibraryToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SoundLibraryToUser_AB_unique`(`A`, `B`),
    INDEX `_SoundLibraryToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SoundToSoundLibrary` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SoundToSoundLibrary_AB_unique`(`A`, `B`),
    INDEX `_SoundToSoundLibrary_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_GameToSoundLibrary` ADD CONSTRAINT `_GameToSoundLibrary_A_fkey` FOREIGN KEY (`A`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GameToSoundLibrary` ADD CONSTRAINT `_GameToSoundLibrary_B_fkey` FOREIGN KEY (`B`) REFERENCES `SoundLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SessionToSoundLibrary` ADD CONSTRAINT `_SessionToSoundLibrary_A_fkey` FOREIGN KEY (`A`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SessionToSoundLibrary` ADD CONSTRAINT `_SessionToSoundLibrary_B_fkey` FOREIGN KEY (`B`) REFERENCES `SoundLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SessionToSound` ADD CONSTRAINT `_SessionToSound_A_fkey` FOREIGN KEY (`A`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SessionToSound` ADD CONSTRAINT `_SessionToSound_B_fkey` FOREIGN KEY (`B`) REFERENCES `Sound`(`cid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SoundLibraryToUser` ADD CONSTRAINT `_SoundLibraryToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `SoundLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SoundLibraryToUser` ADD CONSTRAINT `_SoundLibraryToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SoundToSoundLibrary` ADD CONSTRAINT `_SoundToSoundLibrary_A_fkey` FOREIGN KEY (`A`) REFERENCES `Sound`(`cid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SoundToSoundLibrary` ADD CONSTRAINT `_SoundToSoundLibrary_B_fkey` FOREIGN KEY (`B`) REFERENCES `SoundLibrary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
