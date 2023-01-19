/*
  Warnings:

  - You are about to drop the column `Day1` on the `MemberWeeklyStreak` table. All the data in the column will be lost.
  - You are about to drop the column `Day2` on the `MemberWeeklyStreak` table. All the data in the column will be lost.
  - You are about to drop the column `Day3` on the `MemberWeeklyStreak` table. All the data in the column will be lost.
  - You are about to drop the column `Day4` on the `MemberWeeklyStreak` table. All the data in the column will be lost.
  - You are about to drop the column `Day5` on the `MemberWeeklyStreak` table. All the data in the column will be lost.
  - You are about to drop the column `Day6` on the `MemberWeeklyStreak` table. All the data in the column will be lost.
  - You are about to drop the column `Day7` on the `MemberWeeklyStreak` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MemberWeeklyStreak" DROP COLUMN "Day1",
DROP COLUMN "Day2",
DROP COLUMN "Day3",
DROP COLUMN "Day4",
DROP COLUMN "Day5",
DROP COLUMN "Day6",
DROP COLUMN "Day7",
ADD COLUMN     "day1" BOOLEAN DEFAULT false,
ADD COLUMN     "day2" BOOLEAN DEFAULT false,
ADD COLUMN     "day3" BOOLEAN DEFAULT false,
ADD COLUMN     "day4" BOOLEAN DEFAULT false,
ADD COLUMN     "day5" BOOLEAN DEFAULT false,
ADD COLUMN     "day6" BOOLEAN DEFAULT false,
ADD COLUMN     "day7" BOOLEAN DEFAULT false;
