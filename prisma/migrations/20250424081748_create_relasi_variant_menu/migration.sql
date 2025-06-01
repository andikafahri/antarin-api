-- AddForeignKey
ALTER TABLE `variant` ADD CONSTRAINT `variant_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
