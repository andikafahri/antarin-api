-- AlterTable
ALTER TABLE `order_item` ADD COLUMN `avalaible_qty` INTEGER NULL,
    ADD COLUMN `unavalaible_menu` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `unavalaible_variant` BOOLEAN NOT NULL DEFAULT false;
