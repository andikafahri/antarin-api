/*
  Warnings:

  - The primary key for the `log_order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `log_order_menu_unavailable` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `log_order_menu_unavailable` DROP FOREIGN KEY `log_order_menu_unavailable_id_log_order_fkey`;

-- DropIndex
DROP INDEX `log_order_menu_unavailable_id_log_order_fkey` ON `log_order_menu_unavailable`;

-- AlterTable
ALTER TABLE `log_order` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `log_order_menu_unavailable` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(100) NOT NULL,
    MODIFY `id_log_order` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `log_order_menu_unavailable` ADD CONSTRAINT `log_order_menu_unavailable_id_log_order_fkey` FOREIGN KEY (`id_log_order`) REFERENCES `log_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
