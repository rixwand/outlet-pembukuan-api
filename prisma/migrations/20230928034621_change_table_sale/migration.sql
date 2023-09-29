/*
  Warnings:

  - You are about to drop the column `product_id` on the `sales` table. All the data in the column will be lost.
  - Added the required column `basic_price` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selling_price` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `sales` DROP FOREIGN KEY `sales_product_id_fkey`;

-- AlterTable
ALTER TABLE `sales` DROP COLUMN `product_id`,
    ADD COLUMN `basic_price` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(100) NOT NULL,
    ADD COLUMN `selling_price` INTEGER NOT NULL;
