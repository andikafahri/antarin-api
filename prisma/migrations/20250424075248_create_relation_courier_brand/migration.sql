-- AddForeignKey
ALTER TABLE `courier` ADD CONSTRAINT `courier_id_brand_fkey` FOREIGN KEY (`id_brand`) REFERENCES `brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
