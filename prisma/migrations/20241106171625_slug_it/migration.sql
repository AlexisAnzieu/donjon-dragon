/*
  Warnings:

  - Added the required column `slug` to the `Monster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Monster" ADD COLUMN     "slug" TEXT NOT NULL;
