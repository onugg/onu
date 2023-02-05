/*
  Warnings:

  - You are about to drop the column `name` on the `DiscordMember` table. All the data in the column will be lost.
  - Added the required column `nickname` to the `DiscordMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordMember" DROP COLUMN "name",
ADD COLUMN     "nickname" TEXT NOT NULL;
