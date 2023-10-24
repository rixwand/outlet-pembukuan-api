/*
  Warnings:

  - You are about to drop the `Receivable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Receivable` DROP FOREIGN KEY `Receivable_sale_id_fkey`;

-- DropForeignKey
ALTER TABLE `Receivable` DROP FOREIGN KEY `Receivable_user_id_fkey`;

-- AlterTable
ALTER TABLE `debt` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Receivable`;

-- CreateTable
CREATE TABLE `receivable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` VARCHAR(300) NOT NULL,
    `total` INTEGER NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `user_id` INTEGER NOT NULL,
    `sale_id` INTEGER NOT NULL,

    UNIQUE INDEX `receivable_sale_id_key`(`sale_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `receivable` ADD CONSTRAINT `receivable_sale_id_fkey` FOREIGN KEY (`sale_id`) REFERENCES `sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receivable` ADD CONSTRAINT `receivable_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
