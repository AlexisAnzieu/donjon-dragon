-- CreateTable
CREATE TABLE "LegendaryAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,

    CONSTRAINT "LegendaryAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LegendaryAction" ADD CONSTRAINT "LegendaryAction_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
