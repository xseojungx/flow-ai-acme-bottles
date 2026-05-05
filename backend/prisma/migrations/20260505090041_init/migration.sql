-- CreateTable
CREATE TABLE `supply_orders` (
    `id` VARCHAR(191) NOT NULL,
    `material_type` ENUM('PET', 'PTA', 'EG') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `supplier_name` VARCHAR(191) NULL,
    `tracking_number` VARCHAR(191) NULL,
    `expected_arrival_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_orders` (
    `id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `product_type` ENUM('L1', 'G1') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'IN_PRODUCTION', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completed_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
