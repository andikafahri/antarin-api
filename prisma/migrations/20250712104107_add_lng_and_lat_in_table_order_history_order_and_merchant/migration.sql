/*
  Warnings:

  - Added the required column `lat` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history_order` ADD COLUMN `lat` DECIMAL(10, 8) NOT NULL,
    ADD COLUMN `lng` DECIMAL(11, 8) NOT NULL;

-- AlterTable
ALTER TABLE `merchant` ADD COLUMN `lat` DECIMAL(10, 8) NULL,
    ADD COLUMN `lng` DECIMAL(11, 8) NULL,
    MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE `order` ADD COLUMN `lat` DECIMAL(10, 8) NOT NULL,
    ADD COLUMN `lng` DECIMAL(11, 8) NOT NULL;
