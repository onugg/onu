/*
  Warnings:

  - You are about to drop the column `welcomeChannelId` on the `DiscordGuild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeThreadArchiveDurationMinutes` on the `DiscordGuild` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeType` on the `DiscordGuild` table. All the data in the column will be lost.
  - Made the column `communityId` on table `DiscordGuild` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DiscordGuild" DROP COLUMN "welcomeChannelId",
DROP COLUMN "welcomeThreadArchiveDurationMinutes",
DROP COLUMN "welcomeType",
ALTER COLUMN "communityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "DiscordMemberQuestRecord" ADD COLUMN     "totalExp" INTEGER NOT NULL DEFAULT 0;
