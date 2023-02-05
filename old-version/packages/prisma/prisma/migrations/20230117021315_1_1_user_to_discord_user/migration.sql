/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `DiscordUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DiscordUser_userId_key" ON "DiscordUser"("userId");
