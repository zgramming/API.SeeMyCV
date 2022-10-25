/*
  Warnings:

  - You are about to drop the column `unit` on the `cv_education` table. All the data in the column will be lost.
  - Added the required column `field_of_study` to the `cv_education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cv_education` DROP COLUMN `unit`,
    ADD COLUMN `field_of_study` VARCHAR(100) NOT NULL;
