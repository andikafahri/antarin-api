/*
  Warnings:

  - You are about to drop the column `condition` on the `log_menu_unavailable` table. All the data in the column will be lost.
  - Added the required column `available_qty` to the `log_menu_unavailable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_menu_unavailable` DROP COLUMN `condition`,
    ADD COLUMN `available_qty` INTEGER NOT NULL,
    ADD COLUMN `unavailable_menu` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `unavailable_variant` BOOLEAN NOT NULL DEFAULT false;
