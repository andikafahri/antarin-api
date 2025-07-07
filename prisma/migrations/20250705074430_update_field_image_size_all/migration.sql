/*
  Warnings:

  - Made the column `image` on table `courier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `log_menu_unavailable` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `courier` MODIFY `image` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `history_order_item` MODIFY `image` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `log_menu_unavailable` MODIFY `image` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE `order_item` MODIFY `image` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `image` VARCHAR(200) NULL;