/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `DiscordGuild` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DiscordGuild_discordId_key" ON "DiscordGuild"("discordId");
