-- CreateTable
CREATE TABLE `order` (
    `id` VARCHAR(100) NOT NULL,
    `id_user` VARCHAR(100) NOT NULL,
    `id_merchant` VARCHAR(100) NOT NULL,
    `id_courier` VARCHAR(100) NOT NULL,
    `destination` VARCHAR(200) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NOT NULL,
    `id_status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
