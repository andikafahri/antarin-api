-- CreateTable
CREATE TABLE `order_item` (
    `id` VARCHAR(100) NOT NULL,
    `id_menu` VARCHAR(100) NOT NULL,
    `name_menu` VARCHAR(100) NOT NULL,
    `id_variant` VARCHAR(100) NOT NULL,
    `qty` INTEGER NOT NULL,
    `note` VARCHAR(300) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `id_order` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
