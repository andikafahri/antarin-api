-- CreateTable
CREATE TABLE `time_operational` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_merchant` VARCHAR(100) NOT NULL,
    `day` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    INDEX `time_operational_id_merchant_fkey`(`id_merchant`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `time_operational` ADD CONSTRAINT `time_operational_id_merchant_fkey` FOREIGN KEY (`id_merchant`) REFERENCES `merchant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
