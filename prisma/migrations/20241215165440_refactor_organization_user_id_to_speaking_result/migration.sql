/*
  Warnings:

  - A unique constraint covering the columns `[userId,organizationUserId]` on the table `SpeakingResult` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SpeakingResult" DROP CONSTRAINT "SpeakingResult_organizationUserId_fkey";

-- DropForeignKey
ALTER TABLE "SpeakingResult" DROP CONSTRAINT "SpeakingResult_userId_fkey";

-- AlterTable
ALTER TABLE "SpeakingResult" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "SpeakingResult_userId_organizationUserId_key" ON "SpeakingResult"("userId", "organizationUserId");

-- AddForeignKey
ALTER TABLE "SpeakingResult" ADD CONSTRAINT "SpeakingResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakingResult" ADD CONSTRAINT "SpeakingResult_organizationUserId_fkey" FOREIGN KEY ("organizationUserId") REFERENCES "OrganizationUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
