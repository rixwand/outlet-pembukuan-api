/*
  Warnings:

  - Made the column `user_id` on table `debt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `debt` DROP FOREIGN KEY `debt_expense_id_fkey`;

-- DropForeignKey
ALTER TABLE `debt` DROP FOREIGN KEY `debt_user_id_fkey`;

-- AlterTable
ALTER TABLE `debt` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `expense_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
