-- AlterTable
ALTER TABLE `history_order_item` MODIFY `id_variant` VARCHAR(100) NULL,
    MODIFY `name_variant` VARCHAR(50) NULL,
    MODIFY `price_variant` DECIMAL(10, 2) NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE `order_item` MODIFY `price_variant` DECIMAL(10, 2) NULL DEFAULT 0;
