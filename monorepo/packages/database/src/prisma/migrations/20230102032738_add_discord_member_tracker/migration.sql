-- CreateTable
CREATE TABLE "DiscordMemberTracker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordMemberId" TEXT NOT NULL,
    "messagesSent" INTEGER NOT NULL,

    CONSTRAINT "DiscordMemberTracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordMemberTracker_discordMemberId_key" ON "DiscordMemberTracker"("discordMemberId");

-- AddForeignKey
ALTER TABLE "DiscordMemberTracker" ADD CONSTRAINT "DiscordMemberTracker_discordMemberId_fkey" FOREIGN KEY ("discordMemberId") REFERENCES "DiscordMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
