-- AlterTable
ALTER TABLE `brand` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `city` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `courier` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `menu` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `merchant` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `order_item` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `province` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `status` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `status_order` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `subdistrict` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `variant` MODIFY `update_at` DATETIME(3) NULL;
