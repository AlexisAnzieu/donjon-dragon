/*
  Warnings:

  - You are about to alter the column `size` on the `Token` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Token` MODIFY `size` DOUBLE NOT NULL;
