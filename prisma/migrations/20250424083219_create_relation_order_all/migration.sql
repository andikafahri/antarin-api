-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_merchant_fkey` FOREIGN KEY (`id_merchant`) REFERENCES `merchant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_courier_fkey` FOREIGN KEY (`id_courier`) REFERENCES `courier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
