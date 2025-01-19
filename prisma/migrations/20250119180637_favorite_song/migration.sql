-- AlterTable
ALTER TABLE `Sound` ADD COLUMN `sessionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Sound` ADD CONSTRAINT `Sound_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
