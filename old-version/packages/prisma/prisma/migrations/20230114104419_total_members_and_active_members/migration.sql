-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "activeMembers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMembers" INTEGER NOT NULL DEFAULT 0;
