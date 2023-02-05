/*
  Warnings:

  - Added the required column `domain` to the `MemberQuestLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemberQuestLog" ADD COLUMN     "domain" TEXT NOT NULL;
