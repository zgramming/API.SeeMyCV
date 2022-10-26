-- CreateTable
CREATE TABLE `cv_license_certificate` (
    `id` VARCHAR(191) NOT NULL,
    `users_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `publisher` VARCHAR(100) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `is_expired` BOOLEAN NOT NULL DEFAULT false,
    `url` TEXT NULL,
    `credential` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cv_license_certificate` ADD CONSTRAINT `cv_license_certificate_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
