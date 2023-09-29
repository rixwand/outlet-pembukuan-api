/*
  Warnings:

  - You are about to drop the column `prodcut_id` on the `sales` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_prodcut_id_fkey`;

-- AlterTable
ALTER TABLE `sales` DROP COLUMN `prodcut_id`,
    ADD COLUMN `product_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `sales` ADD CONSTRAINT `sales_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
