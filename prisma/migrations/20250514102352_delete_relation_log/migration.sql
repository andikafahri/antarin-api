-- DropForeignKey
ALTER TABLE `log_order` DROP FOREIGN KEY `log_order_id_order_fkey`;

-- DropForeignKey
ALTER TABLE `log_order_menu_unavailable` DROP FOREIGN KEY `log_order_menu_unavailable_id_order_item_fkey`;

-- DropIndex
DROP INDEX `log_order_id_order_fkey` ON `log_order`;

-- DropIndex
DROP INDEX `log_order_menu_unavailable_id_order_item_fkey` ON `log_order_menu_unavailable`;
