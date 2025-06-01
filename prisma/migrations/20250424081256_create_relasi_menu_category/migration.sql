-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
