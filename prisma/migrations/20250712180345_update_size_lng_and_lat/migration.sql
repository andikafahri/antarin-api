/*
  Warnings:

  - You are about to alter the column `lng` on the `history_address` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Decimal(20,8)`.
  - You are about to alter the column `lat` on the `history_address` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Decimal(20,8)`.
  - You are about to alter the column `lat` on the `history_order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Decimal(20,8)`.
  - You are about to alter the column `lng` on the `history_order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Decimal(20,8)`.
  - You are about to alter the column `lat` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Decimal(20,8)`.
  - You are about to alter the column `lng` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Decimal(20,8)`.

*/
-- AlterTable
ALTER TABLE `history_address` MODIFY `lng` DECIMAL(20, 8) NOT NULL,
    MODIFY `lat` DECIMAL(20, 8) NOT NULL;

-- AlterTable
ALTER TABLE `history_order` MODIFY `lat` DECIMAL(20, 8) NOT NULL,
    MODIFY `lng` DECIMAL(20, 8) NOT NULL;

-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE `order` MODIFY `lat` DECIMAL(20, 8) NOT NULL,
    MODIFY `lng` DECIMAL(20, 8) NOT NULL;
