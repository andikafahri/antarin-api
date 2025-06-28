-- CreateTable
CREATE TABLE `brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `brand` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `id_prov` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courier` (
    `id` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `number_plate` VARCHAR(20) NOT NULL,
    `id_brand` INTEGER NOT NULL,
    `color` VARCHAR(30) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `id_status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `image` VARCHAR(100) NULL,

    UNIQUE INDEX `courier_username_key`(`username`),
    INDEX `courier_id_brand_fkey`(`id_brand`),
    INDEX `courier_id_status_fkey`(`id_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_order` (
    `id` VARCHAR(100) NOT NULL,
    `id_user` VARCHAR(100) NOT NULL,
    `name_user` VARCHAR(100) NOT NULL,
    `id_merchant` VARCHAR(100) NOT NULL,
    `name_merchant` VARCHAR(100) NOT NULL,
    `id_courier` VARCHAR(100) NULL,
    `name_courier` VARCHAR(100) NULL,
    `destination` VARCHAR(200) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `id_city` INTEGER NOT NULL,
    `id_prov` INTEGER NOT NULL,
    `id_subd` INTEGER NOT NULL,
    `name_city` VARCHAR(50) NOT NULL,
    `name_prov` VARCHAR(50) NOT NULL,
    `name_subd` VARCHAR(50) NOT NULL,
    `service_cost` DECIMAL(10, 2) NOT NULL,

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
    `note` VARCHAR(300) NULL,
    `id_order` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `price_menu` DECIMAL(10, 2) NOT NULL,
    `price_variant` DECIMAL(10, 2) NOT NULL,
    `image` VARCHAR(100) NOT NULL,

    INDEX `history_order_item_id_order_fkey`(`id_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `note` VARCHAR(200) NULL,
    `change_by` VARCHAR(50) NOT NULL,
    `id_changer` VARCHAR(100) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `qty` INTEGER NOT NULL,
    `available_qty` INTEGER NOT NULL,
    `unavailable_menu` BOOLEAN NOT NULL DEFAULT false,
    `unavailable_variant` BOOLEAN NOT NULL DEFAULT false,
    `id_menu` VARCHAR(100) NOT NULL,
    `is_confirm` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(100) NULL,

    INDEX `log_menu_unavailable_id_log_order_fkey`(`id_log_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_order` (
    `id` VARCHAR(100) NOT NULL,
    `id_order` VARCHAR(100) NOT NULL,
    `id_status` INTEGER NOT NULL,
    `detail_status` VARCHAR(200) NULL,
    `change_by` VARCHAR(50) NOT NULL,
    `id_changer` VARCHAR(100) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `log_order_id_status_fkey`(`id_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `detail` VARCHAR(300) NULL,
    `id_category` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `is_ready` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `id_merchant` VARCHAR(100) NOT NULL,
    `image` VARCHAR(100) NOT NULL,

    INDEX `menu_id_category_fkey`(`id_category`),
    INDEX `menu_id_merchant_fkey`(`id_merchant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `merchant` (
    `id` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `id_subd` INTEGER NOT NULL,
    `id_city` INTEGER NOT NULL,
    `id_prov` INTEGER NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `is_open` BOOLEAN NOT NULL DEFAULT false,
    `id_status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `image` VARCHAR(100) NULL,

    UNIQUE INDEX `merchant_username_key`(`username`),
    INDEX `merchant_id_city_fkey`(`id_city`),
    INDEX `merchant_id_prov_fkey`(`id_prov`),
    INDEX `merchant_id_status_fkey`(`id_status`),
    INDEX `merchant_id_subd_fkey`(`id_subd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order` (
    `id` VARCHAR(100) NOT NULL,
    `id_user` VARCHAR(100) NOT NULL,
    `id_merchant` VARCHAR(100) NOT NULL,
    `id_courier` VARCHAR(100) NULL,
    `destination` VARCHAR(200) NOT NULL,
    `shipping_cost` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `id_city` INTEGER NOT NULL,
    `id_prov` INTEGER NOT NULL,
    `id_subd` INTEGER NOT NULL,
    `id_status` INTEGER NOT NULL,
    `service_cost` DECIMAL(10, 2) NOT NULL,

    INDEX `order_id_city_fkey`(`id_city`),
    INDEX `order_id_courier_fkey`(`id_courier`),
    INDEX `order_id_merchant_fkey`(`id_merchant`),
    INDEX `order_id_prov_fkey`(`id_prov`),
    INDEX `order_id_status_fkey`(`id_status`),
    INDEX `order_id_subd_fkey`(`id_subd`),
    INDEX `order_id_user_fkey`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_item` (
    `id` VARCHAR(100) NOT NULL,
    `id_menu` VARCHAR(100) NOT NULL,
    `name_menu` VARCHAR(100) NOT NULL,
    `id_variant` VARCHAR(100) NOT NULL,
    `qty` INTEGER NOT NULL,
    `note` VARCHAR(300) NULL,
    `id_order` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `name_variant` VARCHAR(50) NOT NULL,
    `price_menu` DECIMAL(10, 2) NOT NULL,
    `price_variant` DECIMAL(10, 2) NOT NULL,
    `image` VARCHAR(100) NOT NULL,

    INDEX `order_item_id_order_fkey`(`id_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `province` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subdistrict` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `id_city` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `poin` INTEGER NOT NULL,
    `id_status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `image` VARCHAR(100) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    INDEX `user_id_status_fkey`(`id_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variant` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `id_menu` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    INDEX `variant_id_menu_fkey`(`id_menu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variant_item` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `id_variant` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,
    `is_ready` BOOLEAN NOT NULL DEFAULT true,

    INDEX `variant_item_id_variant_fkey`(`id_variant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courier` ADD CONSTRAINT `courier_id_brand_fkey` FOREIGN KEY (`id_brand`) REFERENCES `brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courier` ADD CONSTRAINT `courier_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_order_item` ADD CONSTRAINT `history_order_item_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `history_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_menu_unavailable` ADD CONSTRAINT `log_menu_unavailable_id_log_order_fkey` FOREIGN KEY (`id_log_order`) REFERENCES `log_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_order` ADD CONSTRAINT `log_order_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_id_merchant_fkey` FOREIGN KEY (`id_merchant`) REFERENCES `merchant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_city_fkey` FOREIGN KEY (`id_city`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_prov_fkey` FOREIGN KEY (`id_prov`) REFERENCES `province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_subd_fkey` FOREIGN KEY (`id_subd`) REFERENCES `subdistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_city_fkey` FOREIGN KEY (`id_city`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_courier_fkey` FOREIGN KEY (`id_courier`) REFERENCES `courier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_merchant_fkey` FOREIGN KEY (`id_merchant`) REFERENCES `merchant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_prov_fkey` FOREIGN KEY (`id_prov`) REFERENCES `province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_subd_fkey` FOREIGN KEY (`id_subd`) REFERENCES `subdistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_item` ADD CONSTRAINT `order_item_id_order_fkey` FOREIGN KEY (`id_order`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant` ADD CONSTRAINT `variant_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant_item` ADD CONSTRAINT `variant_item_id_variant_fkey` FOREIGN KEY (`id_variant`) REFERENCES `variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
