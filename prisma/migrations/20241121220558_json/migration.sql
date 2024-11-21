/*
  Warnings:

  - You are about to drop the `SavingThrows` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `saving_throws` to the `Monster` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Monster` DROP FOREIGN KEY `Monster_savingThrowsId_fkey`;

-- AlterTable
ALTER TABLE `Monster` ADD COLUMN `saving_throws` JSON NOT NULL;

-- DropTable
DROP TABLE `SavingThrows`;
