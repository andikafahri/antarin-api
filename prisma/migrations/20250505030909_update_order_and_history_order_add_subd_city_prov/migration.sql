/*
  Warnings:

  - Added the required column `id_city` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_prov` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_subd` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_city` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_prov` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_subd` to the `history_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_city` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_prov` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_subd` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_city` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_prov` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_subd` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history_order` ADD COLUMN `id_city` INTEGER NOT NULL,
    ADD COLUMN `id_prov` INTEGER NOT NULL,
    ADD COLUMN `id_subd` INTEGER NOT NULL,
    ADD COLUMN `name_city` VARCHAR(50) NOT NULL,
    ADD COLUMN `name_prov` VARCHAR(50) NOT NULL,
    ADD COLUMN `name_subd` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `id_city` INTEGER NOT NULL,
    ADD COLUMN `id_prov` INTEGER NOT NULL,
    ADD COLUMN `id_subd` INTEGER NOT NULL,
    ADD COLUMN `name_city` VARCHAR(50) NOT NULL,
    ADD COLUMN `name_prov` VARCHAR(50) NOT NULL,
    ADD COLUMN `name_subd` VARCHAR(50) NOT NULL;
