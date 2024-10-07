-- CreateTable
CREATE TABLE `ads` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `seoDescription` JSON NULL,
    `seoKeywords` JSON NULL,
    `ogTitle` JSON NULL,
    `ogDescription` JSON NULL,
    `ogImage` TEXT NULL,
    `ogUrl` TEXT NULL,
    `twitterCard` TEXT NULL,
    `twitterTitle` JSON NULL,
    `twitterDescription` JSON NULL,
    `twitterImage` TEXT NULL,
    `createdById` CHAR(36) NULL,
    `updatedById` CHAR(36) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_0c97a55ed44c338ea0e11dde597`(`createdById`),
    INDEX `FK_1e32cccaa72c21d19febd24047e`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ads_countries` (
    `ads_id` CHAR(36) NOT NULL,
    `country_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ads_countries_country_id_foreign_key`(`country_id`),
    PRIMARY KEY (`ads_id`, `country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand_categories` (
    `brand_id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `brand_categories_category_id_foreign_key`(`category_id`),
    PRIMARY KEY (`brand_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand_countries` (
    `brand_id` CHAR(36) NOT NULL,
    `country_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `brand_countries_country_id_foreign_key`(`country_id`),
    PRIMARY KEY (`brand_id`, `country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` CHAR(36) NOT NULL,
    `name` JSON NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` JSON NULL,
    `link` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `seoDescription` JSON NULL,
    `seoKeywords` JSON NULL,
    `ogTitle` JSON NULL,
    `ogDescription` JSON NULL,
    `ogImage` TEXT NULL,
    `ogUrl` TEXT NULL,
    `twitterCard` TEXT NULL,
    `twitterTitle` JSON NULL,
    `twitterDescription` JSON NULL,
    `twitterImage` TEXT NULL,
    `mostUsed` INTEGER NOT NULL DEFAULT 0,
    `mostFollowed` INTEGER NOT NULL DEFAULT 0,
    `createdById` CHAR(36) NULL,
    `updatedById` CHAR(36) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_362fe42f4b94ec5c00b7e9f5b79`(`updatedById`),
    INDEX `FK_906c44274a237e695ffc8d8f8f3`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` CHAR(36) NOT NULL,
    `name` JSON NOT NULL,
    `slug` JSON NOT NULL,
    `description` JSON NULL,
    `image` VARCHAR(255) NULL,
    `icon` VARCHAR(255) NULL,
    `color` VARCHAR(255) NULL,
    `seoDescription` JSON NULL,
    `seoKeywords` JSON NULL,
    `ogTitle` JSON NULL,
    `ogDescription` JSON NULL,
    `ogImage` TEXT NULL,
    `ogUrl` TEXT NULL,
    `twitterCard` TEXT NULL,
    `twitterTitle` JSON NULL,
    `twitterDescription` JSON NULL,
    `twitterImage` TEXT NULL,
    `createdById` CHAR(36) NULL,
    `updatedById` CHAR(36) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_a6ada6f4dcf60db496fe71d7a96`(`createdById`),
    INDEX `FK_e8221f562fcc5898e530aa1be6e`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_countries` (
    `category_id` CHAR(36) NOT NULL,
    `country_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `category_countries_country_id_foreign_key`(`country_id`),
    PRIMARY KEY (`category_id`, `country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `countryCode` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `seoDescription` JSON NULL,
    `seoKeywords` JSON NULL,
    `ogTitle` JSON NULL,
    `ogDescription` JSON NULL,
    `ogImage` TEXT NULL,
    `ogUrl` TEXT NULL,
    `twitterCard` TEXT NULL,
    `twitterTitle` JSON NULL,
    `twitterDescription` JSON NULL,
    `twitterImage` TEXT NULL,
    `createdById` CHAR(36) NULL,
    `updatedById` CHAR(36) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_3e2244849b34c8a2536c35d335d`(`updatedById`),
    INDEX `FK_c641ee0320064ee9dced39b5bea`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_brands` (
    `coupon_id` CHAR(36) NOT NULL,
    `brand_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `coupon_brands_brand_id_foreign_key`(`brand_id`),
    PRIMARY KEY (`coupon_id`, `brand_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_categories` (
    `coupon_id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `coupon_categories_category_id_foreign_key`(`category_id`),
    PRIMARY KEY (`coupon_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupon_countries` (
    `coupon_id` CHAR(36) NOT NULL,
    `country_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `coupon_countries_country_id_foreign_key`(`country_id`),
    PRIMARY KEY (`coupon_id`, `country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `amount` FLOAT NOT NULL DEFAULT 1,
    `description` JSON NULL,
    `status` JSON NOT NULL,
    `expire` TIMESTAMP(0) NULL,
    `qrCode` VARCHAR(255) NULL,
    `link` VARCHAR(255) NULL,
    `seoDescription` JSON NULL,
    `seoKeywords` JSON NULL,
    `ogTitle` JSON NULL,
    `ogDescription` JSON NULL,
    `ogImage` TEXT NULL,
    `ogUrl` TEXT NULL,
    `twitterCard` TEXT NULL,
    `twitterTitle` JSON NULL,
    `twitterDescription` JSON NULL,
    `twitterImage` TEXT NULL,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `dislikeCount` INTEGER NOT NULL DEFAULT 0,
    `createdById` CHAR(36) NULL,
    `updatedById` CHAR(36) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_0469ba4cb398e58d873e9d8c25a`(`createdById`),
    INDEX `FK_5fb1c171c25220ad4248aaa36d0`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` CHAR(36) NOT NULL,
    `title` JSON NOT NULL,
    `body` JSON NOT NULL,
    `isWatched` BOOLEAN NOT NULL DEFAULT false,
    `userId` CHAR(36) NULL,
    `createdById` CHAR(36) NULL,
    `sendAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_692a909ee0fa9383e7859f9b406`(`userId`),
    INDEX `FK_fcce8c50a375466676d82dcbadd`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `upload_media` (
    `id` CHAR(36) NOT NULL,
    `url` VARCHAR(255) NULL,
    `filename` VARCHAR(255) NULL,
    `path` VARCHAR(255) NULL,
    `mimetype` VARCHAR(255) NULL,
    `size` INTEGER NULL,
    `entityType` VARCHAR(255) NULL,
    `entityId` CHAR(36) NULL,
    `createdById` CHAR(36) NULL,
    `updatedById` CHAR(36) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_8dc3abb31f7faa70a199755a169`(`updatedById`),
    INDEX `FK_bb5c7cebd4e80a684f17daf33ce`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_disliked_coupons` (
    `user_id` CHAR(36) NOT NULL,
    `coupon_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_disliked_coupons_coupon_id_foreign_key`(`coupon_id`),
    PRIMARY KEY (`user_id`, `coupon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_favorite_coupons` (
    `user_id` CHAR(36) NOT NULL,
    `coupon_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_favorite_coupons_coupon_id_foreign_key`(`coupon_id`),
    PRIMARY KEY (`user_id`, `coupon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_followed_brands` (
    `user_id` CHAR(36) NOT NULL,
    `brand_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_followed_brands_brand_id_foreign_key`(`brand_id`),
    PRIMARY KEY (`user_id`, `brand_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_followed_coupons` (
    `user_id` CHAR(36) NOT NULL,
    `coupon_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_followed_coupons_coupon_id_foreign_key`(`coupon_id`),
    PRIMARY KEY (`user_id`, `coupon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_liked_coupons` (
    `user_id` CHAR(36) NOT NULL,
    `coupon_id` CHAR(36) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_liked_coupons_coupon_id_foreign_key`(`coupon_id`),
    PRIMARY KEY (`user_id`, `coupon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_tokens` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `token` TEXT NOT NULL,
    `os` VARCHAR(255) NOT NULL,
    `osVersion` VARCHAR(255) NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `topics` JSON NULL,
    `createdAt` TIMESTAMP(0) NULL,
    `updatedAt` TIMESTAMP(0) NULL,
    `deletedAt` TIMESTAMP(0) NULL,

    INDEX `FK_92ce9a299624e4c4ffd99b645b6`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `changePasswordTime` TIMESTAMP(0) NULL,
    `phoneNumber` VARCHAR(255) NULL,
    `phoneNumberCountryCode` VARCHAR(255) NULL,
    `countryCode` VARCHAR(255) NULL,
    `userLocale` VARCHAR(255) NOT NULL,
    `role` ENUM('User', 'Admin', 'Employee') NOT NULL DEFAULT 'User',
    `confirmAccount` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('offline', 'online', 'blocked') NOT NULL DEFAULT 'offline',
    `avatar` VARCHAR(255) NULL,
    `birthday` TIMESTAMP(0) NULL,
    `joined` TIMESTAMP(0) NULL,
    `gender` ENUM('male', 'female') NULL,
    `provider` ENUM('system', 'facebook', 'GOOGLE') NOT NULL DEFAULT 'system',
    `verificationCode` VARCHAR(255) NULL,
    `verificationCodeExpiresAt` TIMESTAMP(0) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` TIMESTAMP(0) NULL,
    `lastLogin` TIMESTAMP(0) NULL,
    `lastLogout` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ads` ADD CONSTRAINT `FK_0c97a55ed44c338ea0e11dde597` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ads` ADD CONSTRAINT `FK_1e32cccaa72c21d19febd24047e` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ads_countries` ADD CONSTRAINT `ads_countries_ads_id_foreign_key` FOREIGN KEY (`ads_id`) REFERENCES `ads`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ads_countries` ADD CONSTRAINT `ads_countries_country_id_foreign_key` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brand_categories` ADD CONSTRAINT `brand_categories_brand_id_foreign_key` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brand_categories` ADD CONSTRAINT `brand_categories_category_id_foreign_key` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brand_countries` ADD CONSTRAINT `brand_countries_brand_id_foreign_key` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brand_countries` ADD CONSTRAINT `brand_countries_country_id_foreign_key` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `FK_362fe42f4b94ec5c00b7e9f5b79` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `FK_906c44274a237e695ffc8d8f8f3` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `FK_a6ada6f4dcf60db496fe71d7a96` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `FK_e8221f562fcc5898e530aa1be6e` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `category_countries` ADD CONSTRAINT `category_countries_category_id_foreign_key` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `category_countries` ADD CONSTRAINT `category_countries_country_id_foreign_key` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `countries` ADD CONSTRAINT `FK_3e2244849b34c8a2536c35d335d` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `countries` ADD CONSTRAINT `FK_c641ee0320064ee9dced39b5bea` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_brands` ADD CONSTRAINT `coupon_brands_brand_id_foreign_key` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_brands` ADD CONSTRAINT `coupon_brands_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_categories` ADD CONSTRAINT `coupon_categories_category_id_foreign_key` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_categories` ADD CONSTRAINT `coupon_categories_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_countries` ADD CONSTRAINT `coupon_countries_country_id_foreign_key` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupon_countries` ADD CONSTRAINT `coupon_countries_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupons` ADD CONSTRAINT `FK_0469ba4cb398e58d873e9d8c25a` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `coupons` ADD CONSTRAINT `FK_5fb1c171c25220ad4248aaa36d0` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `FK_692a909ee0fa9383e7859f9b406` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `FK_fcce8c50a375466676d82dcbadd` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `upload_media` ADD CONSTRAINT `FK_8dc3abb31f7faa70a199755a169` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `upload_media` ADD CONSTRAINT `FK_bb5c7cebd4e80a684f17daf33ce` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_disliked_coupons` ADD CONSTRAINT `user_disliked_coupons_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_disliked_coupons` ADD CONSTRAINT `user_disliked_coupons_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_favorite_coupons` ADD CONSTRAINT `user_favorite_coupons_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_favorite_coupons` ADD CONSTRAINT `user_favorite_coupons_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_followed_brands` ADD CONSTRAINT `user_followed_brands_brand_id_foreign_key` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_followed_brands` ADD CONSTRAINT `user_followed_brands_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_followed_coupons` ADD CONSTRAINT `user_followed_coupons_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_followed_coupons` ADD CONSTRAINT `user_followed_coupons_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_liked_coupons` ADD CONSTRAINT `user_liked_coupons_coupon_id_foreign_key` FOREIGN KEY (`coupon_id`) REFERENCES `coupons`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_liked_coupons` ADD CONSTRAINT `user_liked_coupons_user_id_foreign_key` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_tokens` ADD CONSTRAINT `FK_92ce9a299624e4c4ffd99b645b6` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
