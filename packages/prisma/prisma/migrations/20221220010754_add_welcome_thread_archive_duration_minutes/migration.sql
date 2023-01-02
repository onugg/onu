-- AlterTable
ALTER TABLE "DiscordGuild" ADD COLUMN     "welcomeThreadArchiveDurationMinutes" INTEGER;

-- CreateTable
CREATE TABLE "DiscordWelcomeThread" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordGuildId" TEXT NOT NULL,
    "threadDiscordId" TEXT NOT NULL,
    "welcomedUserDiscordId" TEXT NOT NULL,

    CONSTRAINT "DiscordWelcomeThread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscordWelcomeThread" ADD CONSTRAINT "DiscordWelcomeThread_discordGuildId_fkey" FOREIGN KEY ("discordGuildId") REFERENCES "DiscordGuild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
