/*
  Warnings:

  - You are about to drop the `DiscordWelcomeThread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscordWelcomeThreadWelcomers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DiscordWelcomeThread" DROP CONSTRAINT "DiscordWelcomeThread_discordGuildId_fkey";

-- DropForeignKey
ALTER TABLE "DiscordWelcomeThreadWelcomers" DROP CONSTRAINT "DiscordWelcomeThreadWelcomers_discordWelcomeThreadId_fkey";

-- DropTable
DROP TABLE "DiscordWelcomeThread";

-- DropTable
DROP TABLE "DiscordWelcomeThreadWelcomers";
