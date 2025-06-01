/*
  Warnings:

  - You are about to drop the column `name_city` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name_courier` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name_merchant` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name_prov` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name_subd` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name_user` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `name_city`,
    DROP COLUMN `name_courier`,
    DROP COLUMN `name_merchant`,
    DROP COLUMN `name_prov`,
    DROP COLUMN `name_subd`,
    DROP COLUMN `name_user`;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_merchant_fkey` FOREIGN KEY (`id_merchant`) REFERENCES `merchant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_courier_fkey` FOREIGN KEY (`id_courier`) REFERENCES `courier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_subd_fkey` FOREIGN KEY (`id_subd`) REFERENCES `subdistrict`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_city_fkey` FOREIGN KEY (`id_city`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_prov_fkey` FOREIGN KEY (`id_prov`) REFERENCES `province`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
