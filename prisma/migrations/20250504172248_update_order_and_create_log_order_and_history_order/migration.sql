/*
  Warnings:

  - You are about to drop the column `id_status` on the `order` table. All the data in the column will be lost.
  - Added the required column `name_courier` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_merchant` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_user` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_variant` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_id_courier_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_id_merchant_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_id_status_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_id_user_fkey`;

-- DropIndex
DROP INDEX `order_id_courier_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_id_merchant_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_id_status_fkey` ON `order`;

-- DropIndex
DROP INDEX `order_id_user_fkey` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `id_status`,
    ADD COLUMN `name_courier` VARCHAR(100) NOT NULL,
    ADD COLUMN `name_merchant` VARCHAR(100) NOT NULL,
    ADD COLUMN `name_user` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `order_item` ADD COLUMN `name_variant` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `log_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` VARCHAR(100) NOT NULL,
    `id_status` INTEGER NOT NULL,
    `detail_status` VARCHAR(200) NOT NULL,
    `change_by` VARCHAR(50) NOT NULL,
    `id_changer` VARCHAR(100) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_order` (
    `id` VARCHAR(100) NOT NULL,
    `id_user` VARCHAR(100) NOT NULL,
    `name_user` VARCHAR(100) NOT NULL,
    `id_merchant` VARCHAR(100) NOT NULL,
    `name_merchant` VARCHAR(100) NOT NULL,
    `id_courier` VARCHAR(100) NOT NULL,
    `name_courier` VARCHAR(100) NOT NULL,
    `destination` VARCHAR(200) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_order_item` (
    `id` VARCHAR(100) NOT NULL,
    `id_menu` VARCHAR(100) NOT NULL,
    `name_menu` VARCHAR(100) NOT NULL,
    `id_variant` VARCHAR(100) NOT NULL,
    `name_variant` VARCHAR(50) NOT NULL,
    `qty` INTEGER NOT NULL,
    `note` VARCHAR(300) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `id_order` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_order` ADD CONSTRAINT `log_order_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_order_item` ADD CONSTRAINT `history_order_item_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `history_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
