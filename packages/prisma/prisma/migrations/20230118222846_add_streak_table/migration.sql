-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "weeklyStreakStartDayNumber" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "MemberWeeklyStreak" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,
    "lastSeenDateTime" TIMESTAMP(3) NOT NULL,
    "Day1" BOOLEAN DEFAULT false,
    "Day2" BOOLEAN DEFAULT false,
    "Day3" BOOLEAN DEFAULT false,
    "Day4" BOOLEAN DEFAULT false,
    "Day5" BOOLEAN DEFAULT false,
    "Day6" BOOLEAN DEFAULT false,
    "Day7" BOOLEAN DEFAULT false,

    CONSTRAINT "MemberWeeklyStreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberWeeklyStreak_memberId_key" ON "MemberWeeklyStreak"("memberId");

-- AddForeignKey
ALTER TABLE "MemberWeeklyStreak" ADD CONSTRAINT "MemberWeeklyStreak_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
