/*
  Warnings:

  - The primary key for the `Sound` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `cid` was added to the `Sound` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Sound` DROP PRIMARY KEY,
    ADD COLUMN `cid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`cid`);
