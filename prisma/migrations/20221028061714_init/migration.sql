/*
  Warnings:

  - You are about to drop the column `banner` on the `cv_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cv_profile` DROP COLUMN `banner`,
    ADD COLUMN `banner_image` TEXT NULL;
