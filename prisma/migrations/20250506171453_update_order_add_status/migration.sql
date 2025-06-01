/*
  Warnings:

  - Added the required column `id_status` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `id_status` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_id_status_fkey` FOREIGN KEY (`id_status`) REFERENCES `status_order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
