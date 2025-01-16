-- CreateTable
CREATE TABLE `Sound` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `volume` DOUBLE NOT NULL,
    `duration` DOUBLE NOT NULL,
    `loop` BOOLEAN NOT NULL,
    `waveformUrl` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sound` ADD CONSTRAINT `Sound_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
