/*
  Warnings:

  - Added the required column `id_menu` to the `log_menu_unavailable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log_menu_unavailable` ADD COLUMN `id_menu` VARCHAR(100) NOT NULL;
