-- CreateTable
CREATE TABLE `variant` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `id_menu` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
