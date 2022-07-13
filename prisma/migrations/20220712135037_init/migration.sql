-- CreateTable
CREATE TABLE `marker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(20) NOT NULL,
    `latitude` VARCHAR(20) NOT NULL,
    `longitude` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
