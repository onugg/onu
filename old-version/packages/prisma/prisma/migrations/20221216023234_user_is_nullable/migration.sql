-- DropForeignKey
ALTER TABLE "DiscordUser" DROP CONSTRAINT "DiscordUser_userId_fkey";

-- AlterTable
ALTER TABLE "DiscordUser" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscordUser" ADD CONSTRAINT "DiscordUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
