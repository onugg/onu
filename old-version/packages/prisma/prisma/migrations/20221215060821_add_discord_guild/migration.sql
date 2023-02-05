-- CreateTable
CREATE TABLE "DiscordGuild" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "communityId" TEXT NOT NULL,
    "name" TEXT,
    "discordId" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "DiscordGuild_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscordGuild" ADD CONSTRAINT "DiscordGuild_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
