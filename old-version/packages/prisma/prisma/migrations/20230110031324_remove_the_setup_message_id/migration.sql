/*
  Warnings:

  - You are about to drop the column `setupChannelId` on the `DiscordGuild` table. All the data in the column will be lost.
  - You are about to drop the column `setupMessageId` on the `DiscordGuild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscordGuild" DROP COLUMN "setupChannelId",
DROP COLUMN "setupMessageId";
