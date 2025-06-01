/*
  Warnings:

  - Added the required column `id_merchant` to the `menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `id_merchant` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `menu` ADD CONSTRAINT `menu_id_merchant_fkey` FOREIGN KEY (`id_merchant`) REFERENCES `merchant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
