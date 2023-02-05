-- CreateTable
CREATE TABLE "MemberQuestRecordDailySnapshot" (
    "memberId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "totalExp" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "discordMessagesSentLevel" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberQuestRecordDailySnapshot_memberId_snapshotDate_key" ON "MemberQuestRecordDailySnapshot"("memberId", "snapshotDate");

-- AddForeignKey
ALTER TABLE "MemberQuestRecordDailySnapshot" ADD CONSTRAINT "MemberQuestRecordDailySnapshot_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
