/*
  Warnings:

  - The primary key for the `Abilities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creatureId` on the `Action` table. All the data in the column will be lost.
  - The primary key for the `Language` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creatureId` on the `Language` table. All the data in the column will be lost.
  - The primary key for the `Monster` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SavingThrows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creatureId` on the `Sense` table. All the data in the column will be lost.
  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creatureId` on the `Skill` table. All the data in the column will be lost.
  - The primary key for the `SpecialAbility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `creatureId` on the `SpecialAbility` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Monster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `monsterId` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monsterId` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monsterId` to the `Sense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monsterId` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monsterId` to the `SpecialAbility` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_creatureId_fkey";

-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_creatureId_fkey";

-- DropForeignKey
ALTER TABLE "Monster" DROP CONSTRAINT "Monster_abilitiesId_fkey";

-- DropForeignKey
ALTER TABLE "Monster" DROP CONSTRAINT "Monster_savingThrowsId_fkey";

-- DropForeignKey
ALTER TABLE "Sense" DROP CONSTRAINT "Sense_creatureId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_creatureId_fkey";

-- DropForeignKey
ALTER TABLE "SpecialAbility" DROP CONSTRAINT "SpecialAbility_creatureId_fkey";

-- AlterTable
ALTER TABLE "Abilities" DROP CONSTRAINT "Abilities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Abilities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Abilities_id_seq";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
DROP COLUMN "creatureId",
ADD COLUMN     "monsterId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Action_id_seq";

-- AlterTable
ALTER TABLE "Language" DROP CONSTRAINT "Language_pkey",
DROP COLUMN "creatureId",
ADD COLUMN     "monsterId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Language_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Language_id_seq";

-- AlterTable
ALTER TABLE "Monster" DROP CONSTRAINT "Monster_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "abilitiesId" SET DATA TYPE TEXT,
ALTER COLUMN "savingThrowsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Monster_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Monster_id_seq";

-- AlterTable
ALTER TABLE "SavingThrows" DROP CONSTRAINT "SavingThrows_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SavingThrows_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SavingThrows_id_seq";

-- AlterTable
ALTER TABLE "Sense" DROP CONSTRAINT "Sense_pkey",
DROP COLUMN "creatureId",
ADD COLUMN     "monsterId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sense_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sense_id_seq";

-- AlterTable
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_pkey",
DROP COLUMN "creatureId",
ADD COLUMN     "monsterId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Skill_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Skill_id_seq";

-- AlterTable
ALTER TABLE "SpecialAbility" DROP CONSTRAINT "SpecialAbility_pkey",
DROP COLUMN "creatureId",
ADD COLUMN     "monsterId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "SpecialAbility_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SpecialAbility_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Monster_name_key" ON "Monster"("name");

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_abilitiesId_fkey" FOREIGN KEY ("abilitiesId") REFERENCES "Abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_savingThrowsId_fkey" FOREIGN KEY ("savingThrowsId") REFERENCES "SavingThrows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialAbility" ADD CONSTRAINT "SpecialAbility_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sense" ADD CONSTRAINT "Sense_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
