/*
  Warnings:

  - You are about to drop the column `available_qty` on the `log_menu_unavailable` table. All the data in the column will be lost.
  - You are about to drop the column `unavailable_menu` on the `log_menu_unavailable` table. All the data in the column will be lost.
  - You are about to drop the column `unavailable_variant` on the `log_menu_unavailable` table. All the data in the column will be lost.
  - Added the required column `condition` to the `log_menu_unavailable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qty` to the `log_menu_unavailable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_menu_unavailable` DROP COLUMN `available_qty`,
    DROP COLUMN `unavailable_menu`,
    DROP COLUMN `unavailable_variant`,
    ADD COLUMN `condition` VARCHAR(10) NOT NULL,
    ADD COLUMN `qty` INTEGER NOT NULL;
