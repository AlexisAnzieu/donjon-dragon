-- AlterTable
ALTER TABLE "Monster" ADD COLUMN     "damage_resistances" TEXT[],
ADD COLUMN     "damage_vulnerabilities" TEXT[],
ADD COLUMN     "proficiency_bonus" TEXT[];
