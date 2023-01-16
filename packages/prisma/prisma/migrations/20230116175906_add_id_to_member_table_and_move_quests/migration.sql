/*
  Warnings:

  - You are about to drop the `DiscordMemberQuestRecord` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `Member` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "DiscordMemberQuestRecord" DROP CONSTRAINT "DiscordMemberQuestRecord_discordMemberId_fkey";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "DiscordMemberQuestRecord";

-- CreateTable
CREATE TABLE "MemberQuestRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,
    "totalExp" INTEGER NOT NULL DEFAULT 0,
    "discordMessagesSentLevel" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MemberQuestRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberQuestRecord_memberId_key" ON "MemberQuestRecord"("memberId");

-- AddForeignKey
ALTER TABLE "MemberQuestRecord" ADD CONSTRAINT "MemberQuestRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
