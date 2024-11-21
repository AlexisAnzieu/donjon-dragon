-- DropIndex
DROP INDEX `Monster_savingThrowsId_fkey` ON `Monster`;

-- AlterTable
ALTER TABLE `Monster` MODIFY `saving_throws` JSON NULL;
