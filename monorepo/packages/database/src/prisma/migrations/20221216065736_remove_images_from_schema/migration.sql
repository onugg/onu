/*
  Warnings:

  - You are about to drop the column `image` on the `DiscordGuild` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `DiscordMember` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `DiscordUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscordGuild" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "DiscordMember" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "DiscordUser" DROP COLUMN "image";
