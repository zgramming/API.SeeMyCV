/*
  Warnings:

  - You are about to alter the column `status` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("users_status")`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('active', 'inactive', 'blocked', 'process_verification') NOT NULL DEFAULT 'inactive';
