-- CreateTable
CREATE TABLE "DiscordQuestConfig" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordGuildId" TEXT NOT NULL,
    "discordQuestsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "communityCanToggleQuests" BOOLEAN NOT NULL DEFAULT true,
    "communityCanModifyQuests" BOOLEAN NOT NULL DEFAULT false,
    "messagesSentEnabled" BOOLEAN NOT NULL DEFAULT true,
    "messagesSentIncrementByLevel" INTEGER NOT NULL DEFAULT 50,
    "messagesSentRewardMultiplierByLevel" INTEGER NOT NULL DEFAULT 50,
    "messagesSentMaxLevels" INTEGER NOT NULL DEFAULT 999,

    CONSTRAINT "DiscordQuestConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordQuestConfig_discordGuildId_key" ON "DiscordQuestConfig"("discordGuildId");

-- AddForeignKey
ALTER TABLE "DiscordQuestConfig" ADD CONSTRAINT "DiscordQuestConfig_discordGuildId_fkey" FOREIGN KEY ("discordGuildId") REFERENCES "DiscordGuild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
