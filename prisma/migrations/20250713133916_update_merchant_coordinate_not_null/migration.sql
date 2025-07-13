/*
  Warnings:

  - Made the column `lat` on table `merchant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lng` on table `merchant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `merchant` MODIFY `is_open_mode` VARCHAR(10) NOT NULL DEFAULT 'auto',
    MODIFY `lat` DECIMAL(10, 8) NOT NULL,
    MODIFY `lng` DECIMAL(11, 8) NOT NULL;
