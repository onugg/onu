-- CreateTable
CREATE TABLE "DiscordWelcomeThreadWelcomers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discordWelcomeThreadId" TEXT NOT NULL,
    "welcomerDiscordId" TEXT NOT NULL,

    CONSTRAINT "DiscordWelcomeThreadWelcomers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscordWelcomeThreadWelcomers" ADD CONSTRAINT "DiscordWelcomeThreadWelcomers_discordWelcomeThreadId_fkey" FOREIGN KEY ("discordWelcomeThreadId") REFERENCES "DiscordWelcomeThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
