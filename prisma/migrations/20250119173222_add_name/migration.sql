-- AlterTable
ALTER TABLE `Game` ADD COLUMN `googleCalendarUrl` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL DEFAULT 'My new campaign';
