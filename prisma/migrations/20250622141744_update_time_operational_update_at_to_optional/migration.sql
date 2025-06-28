-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE `time_operational` MODIFY `update_at` DATETIME(3) NULL;
