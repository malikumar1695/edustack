/*
  Warnings:

  - You are about to drop the column `gaurdianName` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `gaurdianPhone` on the `Student` table. All the data in the column will be lost.
  - Added the required column `guardianName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guardianPhone` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "gaurdianName",
DROP COLUMN "gaurdianPhone",
ADD COLUMN     "guardianName" TEXT NOT NULL,
ADD COLUMN     "guardianPhone" TEXT NOT NULL;
