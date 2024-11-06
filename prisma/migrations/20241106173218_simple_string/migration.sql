/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_monsterId_fkey";

-- DropForeignKey
ALTER TABLE "Sense" DROP CONSTRAINT "Sense_monsterId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_monsterId_fkey";

-- AlterTable
ALTER TABLE "Monster" ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "senses" TEXT[],
ADD COLUMN     "skills" TEXT[];

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Sense";

-- DropTable
DROP TABLE "Skill";
