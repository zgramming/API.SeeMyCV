/*
  Warnings:

  - You are about to drop the column `email` on the `cv_profile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `cv_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cv_profile` DROP COLUMN `email`,
    DROP COLUMN `name`;
