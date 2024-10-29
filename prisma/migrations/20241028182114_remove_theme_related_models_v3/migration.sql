/*
  Warnings:

  - Added the required column `theme` to the `SpeakingResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SpeakingResult" ADD COLUMN     "theme" TEXT NOT NULL;
