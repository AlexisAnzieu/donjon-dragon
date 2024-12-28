-- AlterTable
ALTER TABLE `Token` ADD COLUMN `characterId` VARCHAR(191) NULL,
    ADD COLUMN `icon` VARCHAR(191) NULL,
    ADD COLUMN `monsterId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
