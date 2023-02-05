-- CreateTable
CREATE TABLE "DiscordMemberQuestRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordMemberId" TEXT NOT NULL,
    "messagesSentLevel" INTEGER NOT NULL,

    CONSTRAINT "DiscordMemberQuestRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordMemberQuestRecord_discordMemberId_key" ON "DiscordMemberQuestRecord"("discordMemberId");

-- AddForeignKey
ALTER TABLE "DiscordMemberQuestRecord" ADD CONSTRAINT "DiscordMemberQuestRecord_discordMemberId_fkey" FOREIGN KEY ("discordMemberId") REFERENCES "DiscordMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
