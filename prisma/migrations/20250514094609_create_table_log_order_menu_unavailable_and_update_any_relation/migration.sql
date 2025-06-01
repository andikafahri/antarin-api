-- CreateTable
CREATE TABLE `log_order_menu_unavailable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_log_order` INTEGER NOT NULL,
    `id_order_item` VARCHAR(100) NOT NULL,
    `unavailable_menu` BOOLEAN NOT NULL DEFAULT false,
    `unavailable_variant` BOOLEAN NOT NULL DEFAULT false,
    `avalaible_qty` INTEGER NULL,
    `change_by` VARCHAR(50) NOT NULL,
    `id_changer` VARCHAR(100) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_order` ADD CONSTRAINT `log_order_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_order_menu_unavailable` ADD CONSTRAINT `log_order_menu_unavailable_id_log_order_fkey` FOREIGN KEY (`id_log_order`) REFERENCES `log_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_order_menu_unavailable` ADD CONSTRAINT `log_order_menu_unavailable_id_order_item_fkey` FOREIGN KEY (`id_order_item`) REFERENCES `order_item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
