-- DropForeignKey
ALTER TABLE "SpeakingResult" DROP CONSTRAINT "SpeakingResult_userId_fkey";

-- AlterTable
ALTER TABLE "SpeakingResult" ADD COLUMN     "organizationUserId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "SpeakingResult_organizationUserId_createdAt_idx" ON "SpeakingResult"("organizationUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "SpeakingResult" ADD CONSTRAINT "SpeakingResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakingResult" ADD CONSTRAINT "SpeakingResult_organizationUserId_fkey" FOREIGN KEY ("organizationUserId") REFERENCES "OrganizationUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
