/*
  Warnings:

  - You are about to drop the column `nama` on the `marker` table. All the data in the column will be lost.
  - Added the required column `address` to the `marker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `marker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `marker` DROP COLUMN `nama`,
    ADD COLUMN `address` VARCHAR(50) NOT NULL,
    ADD COLUMN `name` VARCHAR(20) NOT NULL;
