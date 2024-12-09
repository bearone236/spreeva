/*
  Warnings:

  - You are about to drop the `EvaluationRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EvaluationRequest" DROP CONSTRAINT "EvaluationRequest_speakingResultId_fkey";

-- DropTable
DROP TABLE "EvaluationRequest";
