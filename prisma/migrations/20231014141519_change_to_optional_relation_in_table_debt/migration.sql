-- DropForeignKey
ALTER TABLE `debt` DROP FOREIGN KEY `debt_user_id_fkey`;

-- AlterTable
ALTER TABLE `debt` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
