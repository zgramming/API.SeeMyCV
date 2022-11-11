-- CreateTable
CREATE TABLE `cv_website_template` (
    `id` VARCHAR(191) NOT NULL,
    `users_id` INTEGER NOT NULL,
    `template_website_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    UNIQUE INDEX `cv_website_template_users_id_key`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cv_website_template` ADD CONSTRAINT `cv_website_template_template_website_id_fkey` FOREIGN KEY (`template_website_id`) REFERENCES `master_data`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cv_website_template` ADD CONSTRAINT `cv_website_template_users_id_fkey` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
