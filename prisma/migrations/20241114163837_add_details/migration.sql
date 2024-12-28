-- AlterTable
ALTER TABLE `Character` ADD COLUMN `alignment` VARCHAR(191) NULL,
    ADD COLUMN `bonds` TEXT NULL,
    ADD COLUMN `flaws` TEXT NULL,
    ADD COLUMN `ideals` TEXT NULL,
    ADD COLUMN `traits` TEXT NULL;
