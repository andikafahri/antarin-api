-- AlterTable
ALTER TABLE `menu` MODIFY `image` VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE `merchant` MODIFY `image` VARCHAR(200) NULL,
    MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';
