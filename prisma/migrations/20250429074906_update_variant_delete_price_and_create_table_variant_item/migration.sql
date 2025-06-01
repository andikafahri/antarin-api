/*
  Warnings:

  - You are about to drop the column `price` on the `variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `variant` DROP COLUMN `price`;

-- CreateTable
CREATE TABLE `variant_item` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `id_variant` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `variant_item` ADD CONSTRAINT `variant_item_id_variant_fkey` FOREIGN KEY (`id_variant`) REFERENCES `variant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
