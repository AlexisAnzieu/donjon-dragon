-- DropForeignKey
ALTER TABLE "Monster" DROP CONSTRAINT "Monster_abilitiesId_fkey";

-- DropForeignKey
ALTER TABLE "Monster" DROP CONSTRAINT "Monster_savingThrowsId_fkey";

-- AlterTable
ALTER TABLE "Monster" ALTER COLUMN "abilitiesId" DROP NOT NULL,
ALTER COLUMN "savingThrowsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_abilitiesId_fkey" FOREIGN KEY ("abilitiesId") REFERENCES "Abilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_savingThrowsId_fkey" FOREIGN KEY ("savingThrowsId") REFERENCES "SavingThrows"("id") ON DELETE SET NULL ON UPDATE CASCADE;
