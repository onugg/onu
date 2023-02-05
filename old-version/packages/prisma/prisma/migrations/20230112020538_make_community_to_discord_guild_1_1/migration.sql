/*
  Warnings:

  - A unique constraint covering the columns `[communityId]` on the table `DiscordGuild` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DiscordGuild" DROP CONSTRAINT "DiscordGuild_communityId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuild_communityId_key" ON "DiscordGuild"("communityId");

-- AddForeignKey
ALTER TABLE "DiscordGuild" ADD CONSTRAINT "DiscordGuild_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;
