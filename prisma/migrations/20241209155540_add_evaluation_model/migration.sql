/*
  Warnings:

  - You are about to drop the column `aiEvaluation` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `aiImprovedText` on the `SpeakingResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SpeakingResult" DROP COLUMN "aiEvaluation",
DROP COLUMN "aiImprovedText";

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "speakingResultId" TEXT NOT NULL,
    "aiEvaluation" TEXT NOT NULL,
    "aiImprovedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Evaluation_speakingResultId_idx" ON "Evaluation"("speakingResultId");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_speakingResultId_fkey" FOREIGN KEY ("speakingResultId") REFERENCES "SpeakingResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
