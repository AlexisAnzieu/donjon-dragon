/*
  Warnings:

  - You are about to drop the column `abilitiesId` on the `Monster` table. All the data in the column will be lost.
  - You are about to drop the column `savingThrowsId` on the `Monster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Monster` DROP COLUMN `abilitiesId`,
    DROP COLUMN `savingThrowsId`,
    MODIFY `skills` JSON NULL,
    MODIFY `senses` JSON NULL,
    MODIFY `languages` JSON NULL,
    MODIFY `damage_immunities` JSON NULL,
    MODIFY `condition_immunities` JSON NULL,
    MODIFY `damage_resistances` JSON NULL,
    MODIFY `proficiency_bonus` JSON NULL,
    MODIFY `damage_vulnerabilities` JSON NULL;
