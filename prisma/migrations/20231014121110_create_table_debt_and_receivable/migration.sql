/*
  Warnings:

  - You are about to drop the column `debt` on the `expenses` table. All the data in the column will be lost.
  - You are about to drop the column `receivable` on the `sales` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `expenses` DROP COLUMN `debt`;

-- AlterTable
ALTER TABLE `sales` DROP COLUMN `receivable`;

-- CreateTable
CREATE TABLE `debt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` VARCHAR(300) NOT NULL,
    `total` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expense_id` INTEGER NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receivable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` VARCHAR(300) NOT NULL,
    `total` INTEGER NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `user_id` INTEGER NOT NULL,
    `sale_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debt` ADD CONSTRAINT `debt_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receivable` ADD CONSTRAINT `Receivable_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Receivable` ADD CONSTRAINT `Receivable_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
