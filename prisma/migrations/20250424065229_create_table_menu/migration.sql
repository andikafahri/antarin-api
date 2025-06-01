-- CreateTable
CREATE TABLE `menu` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `detail` VARCHAR(300) NOT NULL,
    `id_category` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `is_ready` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;
