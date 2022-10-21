/*
  Warnings:

  - A unique constraint covering the columns `[users_id]` on the table `cv_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cv_profile_users_id_key` ON `cv_profile`(`users_id`);
