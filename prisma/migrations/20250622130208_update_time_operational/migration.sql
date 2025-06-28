-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto';

-- AlterTable
ALTER TABLE `time_operational` MODIFY `start_time` VARCHAR(5) NOT NULL,
    MODIFY `end_time` VARCHAR(5) NOT NULL;
