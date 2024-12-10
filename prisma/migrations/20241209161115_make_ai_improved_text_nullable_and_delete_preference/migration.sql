/*
  Warnings:

  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "aiImprovedText" DROP NOT NULL;

-- DropTable
DROP TABLE "UserPreference";
