/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Monster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Monster_slug_key" ON "Monster"("slug");
