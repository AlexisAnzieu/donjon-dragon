-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "race" TEXT,
    "class" TEXT,
    "background" TEXT,
    "abilityScores" JSONB NOT NULL,
    "equipment" TEXT[],
    "skills" TEXT[],
    "rollDetails" JSONB NOT NULL,
    "hp" INTEGER,
    "userId" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
