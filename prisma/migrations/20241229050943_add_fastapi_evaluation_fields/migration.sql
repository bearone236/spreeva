-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "diversityScore" DOUBLE PRECISION,
ADD COLUMN     "exactMatches" INTEGER,
ADD COLUMN     "highlightedWords" TEXT,
ADD COLUMN     "overallScore" DOUBLE PRECISION,
ADD COLUMN     "penalty" DOUBLE PRECISION,
ADD COLUMN     "similarityPercentage" INTEGER,
ADD COLUMN     "similarityScore" DOUBLE PRECISION;
