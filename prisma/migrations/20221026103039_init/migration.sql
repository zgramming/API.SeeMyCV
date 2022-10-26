/*
  Warnings:

  - You are about to drop the column `image` on the `cv_portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cv_portfolio` DROP COLUMN `image`,
    ADD COLUMN `thumbnail` TEXT NULL;
