-- CreateTable
CREATE TABLE "MemberQuestLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,
    "questDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "MemberQuestLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberQuestLog" ADD CONSTRAINT "MemberQuestLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
