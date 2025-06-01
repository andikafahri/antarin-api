/*
  Warnings:

  - You are about to drop the column `avalaible_qty` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `unavalaible_menu` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `unavalaible_variant` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the `log_order_menu_unavailable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `log_order_menu_unavailable` DROP FOREIGN KEY `log_order_menu_unavailable_id_log_order_fkey`;

-- AlterTable
ALTER TABLE `order_item` DROP COLUMN `avalaible_qty`,
    DROP COLUMN `unavalaible_menu`,
    DROP COLUMN `unavalaible_variant`;

-- DropTable
DROP TABLE `log_order_menu_unavailable`;

-- CreateTable
CREATE TABLE `log_menu_unavailable` (
    `id` VARCHAR(100) NOT NULL,
    `id_log_order` VARCHAR(100) NOT NULL,
    `id_item` VARCHAR(100) NOT NULL,
    `name_menu` VARCHAR(100) NOT NULL,
    `id_variant` VARCHAR(100) NOT NULL,
    `name_variant` VARCHAR(50) NOT NULL,
    `price_menu` DECIMAL(10, 2) NOT NULL,
    `price_variant` DECIMAL(10, 2) NOT NULL,
    `unavailable_menu` BOOLEAN NOT NULL DEFAULT false,
    `unavailable_variant` BOOLEAN NOT NULL DEFAULT false,
    `available_qty` INTEGER NULL,
    `note` VARCHAR(200) NULL,
    `change_by` VARCHAR(50) NOT NULL,
    `id_changer` VARCHAR(100) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_menu_unavailable` ADD CONSTRAINT `log_menu_unavailable_id_log_order_fkey` FOREIGN KEY (`id_log_order`) REFERENCES `log_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
