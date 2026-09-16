/*
  Warnings:

  - A unique constraint covering the columns `[loginUsername]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "loginUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_loginUsername_key" ON "Student"("loginUsername");
