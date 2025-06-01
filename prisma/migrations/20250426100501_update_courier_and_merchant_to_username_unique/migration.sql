/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `courier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `merchant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `courier_username_key` ON `courier`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `merchant_username_key` ON `merchant`(`username`);
