-- CreateTable
CREATE TABLE `cv_contact` (
    `id` VARCHAR(191) NOT NULL,
    `users_id` INTEGER NOT NULL,
    `email_sender` TEXT NOT NULL,
    `subject_sender` TEXT NOT NULL,
    `content_sender` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cv_contact` ADD CONSTRAINT `cv_contact_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
