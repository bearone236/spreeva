/*
  Warnings:

  - You are about to drop the column `themeId` on the `SpeakingResult` table. All the data in the column will be lost.
  - You are about to drop the `SavedTheme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `level` on the `SpeakingResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "SavedTheme" DROP CONSTRAINT "SavedTheme_themeId_fkey";

-- DropForeignKey
ALTER TABLE "SavedTheme" DROP CONSTRAINT "SavedTheme_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpeakingResult" DROP CONSTRAINT "SpeakingResult_themeId_fkey";

-- DropIndex
DROP INDEX "SpeakingResult_themeId_idx";

-- AlterTable
ALTER TABLE "SpeakingResult" DROP COLUMN "themeId",
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL;

-- DropTable
DROP TABLE "SavedTheme";

-- DropTable
DROP TABLE "Theme";

-- DropEnum
DROP TYPE "GenerationType";

-- DropEnum
DROP TYPE "ThemeLevel";
