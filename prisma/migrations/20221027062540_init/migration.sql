-- CreateTable
CREATE TABLE `cv_preview` (
    `id` VARCHAR(191) NOT NULL,
    `users_id` INTEGER NOT NULL,
    `code_template_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cv_preview` ADD CONSTRAINT `cv_preview_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cv_preview` ADD CONSTRAINT `cv_preview_code_template_id_fkey` FOREIGN KEY (`code_template_id`) REFERENCES `master_data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
