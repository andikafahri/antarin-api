-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
