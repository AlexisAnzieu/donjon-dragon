-- CreateTable
CREATE TABLE "Monster" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "alignment" TEXT NOT NULL,
    "armor_class" TEXT NOT NULL,
    "hit_points" INTEGER NOT NULL,
    "hit_dice" TEXT NOT NULL,
    "hit_points_roll" TEXT NOT NULL,
    "speed" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "challenge_rating" INTEGER,
    "xp" INTEGER NOT NULL,
    "abilitiesId" INTEGER NOT NULL,
    "savingThrowsId" INTEGER NOT NULL,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abilities" (
    "id" SERIAL NOT NULL,
    "STR" JSONB NOT NULL,
    "DEX" JSONB NOT NULL,
    "CON" JSONB NOT NULL,
    "INT" JSONB NOT NULL,
    "WIS" JSONB NOT NULL,
    "CHA" JSONB NOT NULL,

    CONSTRAINT "Abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creatureId" INTEGER NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialAbility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creatureId" INTEGER NOT NULL,

    CONSTRAINT "SpecialAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingThrows" (
    "id" SERIAL NOT NULL,
    "STR" TEXT,
    "DEX" TEXT,
    "CON" TEXT,
    "INT" TEXT,
    "WIS" TEXT,
    "CHA" TEXT,

    CONSTRAINT "SavingThrows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "creatureId" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sense" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "creatureId" INTEGER NOT NULL,

    CONSTRAINT "Sense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "creatureId" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_abilitiesId_fkey" FOREIGN KEY ("abilitiesId") REFERENCES "Abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_savingThrowsId_fkey" FOREIGN KEY ("savingThrowsId") REFERENCES "SavingThrows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialAbility" ADD CONSTRAINT "SpecialAbility_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sense" ADD CONSTRAINT "Sense_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
