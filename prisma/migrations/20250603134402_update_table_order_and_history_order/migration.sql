/*
  Warnings:

  - Added the required column `service_cost` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_cost` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history_order` ADD COLUMN `service_cost` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `service_cost` DECIMAL(10, 2) NOT NULL,
    MODIFY `id_courier` VARCHAR(100) NULL;
