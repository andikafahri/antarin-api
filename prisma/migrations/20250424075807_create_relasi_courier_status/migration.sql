-- AddForeignKey
ALTER TABLE `courier` ADD CONSTRAINT `courier_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
