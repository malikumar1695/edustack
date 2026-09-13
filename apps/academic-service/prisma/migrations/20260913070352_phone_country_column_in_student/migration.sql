/*
  Warnings:

  - Added the required column `countryOfResidence` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneCountry` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "countryOfResidence" CHAR(2) NOT NULL,
ADD COLUMN     "phoneCountry" CHAR(2) NOT NULL;
