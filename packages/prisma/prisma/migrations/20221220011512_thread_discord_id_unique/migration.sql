/*
  Warnings:

  - A unique constraint covering the columns `[threadDiscordId]` on the table `DiscordWelcomeThread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DiscordWelcomeThread_threadDiscordId_key" ON "DiscordWelcomeThread"("threadDiscordId");
