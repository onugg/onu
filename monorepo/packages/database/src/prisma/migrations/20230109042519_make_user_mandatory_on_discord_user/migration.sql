/*
  Warnings:

  - Made the column `userId` on table `DiscordUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DiscordUser" DROP CONSTRAINT "DiscordUser_userId_fkey";

-- AlterTable
ALTER TABLE "DiscordUser" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "DiscordUser" ADD CONSTRAINT "DiscordUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
