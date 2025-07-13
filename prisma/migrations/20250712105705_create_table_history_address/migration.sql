-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- CreateTable
CREATE TABLE `history_address` (
    `id` VARCHAR(100) NOT NULL,
    `id_user` VARCHAR(100) NOT NULL,
    `name` VARCHAR(50) NULL,
    `address` VARCHAR(200) NOT NULL,
    `id_subd` INTEGER NOT NULL,
    `id_city` INTEGER NOT NULL,
    `id_prov` INTEGER NOT NULL,
    `lng` DECIMAL(11, 8) NOT NULL,
    `lat` DECIMAL(10, 8) NOT NULL,
    `is_bookmark` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `history_address` ADD CONSTRAINT `history_address_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_address` ADD CONSTRAINT `history_address_id_subd_fkey` FOREIGN KEY (`id_subd`) REFERENCES `subdistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_address` ADD CONSTRAINT `history_address_id_city_fkey` FOREIGN KEY (`id_city`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_address` ADD CONSTRAINT `history_address_id_prov_fkey` FOREIGN KEY (`id_prov`) REFERENCES `province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
