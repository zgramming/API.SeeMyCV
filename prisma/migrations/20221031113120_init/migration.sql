/*
  Warnings:

  - A unique constraint covering the columns `[users_id,slug]` on the table `cv_portfolio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cv_portfolio_users_id_slug_key` ON `cv_portfolio`(`users_id`, `slug`);
