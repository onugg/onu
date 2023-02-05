/*
  Warnings:

  - Added the required column `discriminator` to the `DiscordUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscordUser" ADD COLUMN     "discriminator" TEXT NOT NULL;
