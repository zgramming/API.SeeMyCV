/*
  Warnings:

  - Added the required column `type` to the `cv_preview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cv_preview` ADD COLUMN `type` ENUM('pdf', 'website') NOT NULL;
