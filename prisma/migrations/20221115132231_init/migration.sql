-- DropForeignKey
ALTER TABLE `cv_template_pdf` DROP FOREIGN KEY `cv_template_pdf_template_pdf_id_fkey`;

-- DropForeignKey
ALTER TABLE `cv_template_website` DROP FOREIGN KEY `cv_template_website_template_website_id_fkey`;

-- AlterTable
ALTER TABLE `cv_template_pdf` MODIFY `template_pdf_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `cv_template_website` MODIFY `template_website_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `cv_template_pdf` ADD CONSTRAINT `cv_template_pdf_template_pdf_id_fkey` FOREIGN KEY (`template_pdf_id`) REFERENCES `master_data`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cv_template_website` ADD CONSTRAINT `cv_template_website_template_website_id_fkey` FOREIGN KEY (`template_website_id`) REFERENCES `master_data`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
