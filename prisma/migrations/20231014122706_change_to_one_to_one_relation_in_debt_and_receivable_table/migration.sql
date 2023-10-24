/*
  Warnings:

  - A unique constraint covering the columns `[sale_id]` on the table `Receivable` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expense_id]` on the table `debt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Receivable_sale_id_key` ON `Receivable`(`sale_id`);

-- CreateIndex
CREATE UNIQUE INDEX `debt_expense_id_key` ON `debt`(`expense_id`);
