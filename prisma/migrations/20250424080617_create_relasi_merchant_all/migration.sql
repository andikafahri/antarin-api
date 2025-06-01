-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_subd_fkey` FOREIGN KEY (`id_subd`) REFERENCES `subdistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_city_fkey` FOREIGN KEY (`id_city`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_prov_fkey` FOREIGN KEY (`id_prov`) REFERENCES `province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `merchant` ADD CONSTRAINT `merchant_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
