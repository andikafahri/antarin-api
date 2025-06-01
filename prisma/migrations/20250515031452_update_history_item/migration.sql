/*
  Warnings:

  - You are about to drop the column `price` on the `history_order_item` table. All the data in the column will be lost.
  - Added the required column `price_menu` to the `history_order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_variant` to the `history_order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history_order_item` DROP COLUMN `price`,
    ADD COLUMN `price_menu` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `price_variant` DECIMAL(10, 2) NOT NULL,
    MODIFY `note` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `variant_item` ADD COLUMN `is_ready` BOOLEAN NOT NULL DEFAULT true;
