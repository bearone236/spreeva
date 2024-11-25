/*
  Warnings:

  - You are about to drop the column `contentRelevance` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `fluency` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `grammarAccuracy` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciationClarity` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `speechScore` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the column `vocabularyRange` on the `SpeakingResult` table. All the data in the column will be lost.
  - Added the required column `status` to the `EvaluationRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `themeId` to the `SpeakingResult` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `level` on the `SpeakingResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ThemeLevel" AS ENUM ('Low', 'Middle', 'High');

-- CreateEnum
CREATE TYPE "GenerationType" AS ENUM ('quickstart', 'ocr');

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EvaluationRequest" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SpeakingResult" DROP COLUMN "contentRelevance",
DROP COLUMN "fluency",
DROP COLUMN "grammarAccuracy",
DROP COLUMN "pronunciationClarity",
DROP COLUMN "speechScore",
DROP COLUMN "theme",
DROP COLUMN "vocabularyRange",
ADD COLUMN     "themeId" TEXT NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "ThemeLevel" NOT NULL;

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultThinkTime" INTEGER NOT NULL DEFAULT 30,
    "defaultSpeakTime" INTEGER NOT NULL DEFAULT 60,
    "defaultThemeLevel" TEXT NOT NULL DEFAULT 'Middle',
    "autoReadTheme" BOOLEAN NOT NULL DEFAULT false,
    "showTheme" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "level" "ThemeLevel" NOT NULL,
    "generationType" "GenerationType" NOT NULL,
    "sourceText" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedTheme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "Theme_level_idx" ON "Theme"("level");

-- CreateIndex
CREATE INDEX "Theme_category_idx" ON "Theme"("category");

-- CreateIndex
CREATE UNIQUE INDEX "SavedTheme_userId_themeId_key" ON "SavedTheme"("userId", "themeId");

-- CreateIndex
CREATE INDEX "EvaluationRequest_speakingResultId_idx" ON "EvaluationRequest"("speakingResultId");

-- CreateIndex
CREATE INDEX "SpeakingResult_userId_createdAt_idx" ON "SpeakingResult"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SpeakingResult_themeId_idx" ON "SpeakingResult"("themeId");

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTheme" ADD CONSTRAINT "SavedTheme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTheme" ADD CONSTRAINT "SavedTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakingResult" ADD CONSTRAINT "SpeakingResult_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
