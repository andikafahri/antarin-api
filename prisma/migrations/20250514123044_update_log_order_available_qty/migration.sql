/*
  Warnings:

  - You are about to drop the column `avalaible_qty` on the `log_order_menu_unavailable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `log_order_menu_unavailable` DROP COLUMN `avalaible_qty`,
    ADD COLUMN `available_qty` INTEGER NULL;
