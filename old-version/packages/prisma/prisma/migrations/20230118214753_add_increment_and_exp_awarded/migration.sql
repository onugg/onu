/*
  Warnings:

  - Added the required column `expAwarded` to the `MemberQuestLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemberQuestLog" ADD COLUMN     "expAwarded" INTEGER NOT NULL,
ADD COLUMN     "increment" INTEGER;
