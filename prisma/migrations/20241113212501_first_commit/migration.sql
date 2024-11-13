-- CreateTable
CREATE TABLE `Character` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NULL,
    `race` VARCHAR(191) NULL,
    `class` VARCHAR(191) NULL,
    `background` VARCHAR(191) NULL,
    `abilityScores` JSON NOT NULL,
    `equipment` JSON NOT NULL,
    `skills` JSON NOT NULL,
    `rollDetails` JSON NOT NULL,
    `hp` INTEGER NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Monster` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `alignment` VARCHAR(191) NOT NULL,
    `armor_class` VARCHAR(191) NOT NULL,
    `hit_points` INTEGER NOT NULL,
    `hit_dice` VARCHAR(191) NULL,
    `hit_points_roll` VARCHAR(191) NULL,
    `speed` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `source` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `skills` JSON NOT NULL,
    `senses` JSON NOT NULL,
    `languages` JSON NOT NULL,
    `damage_immunities` JSON NOT NULL,
    `condition_immunities` JSON NOT NULL,
    `damage_resistances` JSON NOT NULL,
    `proficiency_bonus` JSON NOT NULL,
    `damage_vulnerabilities` JSON NOT NULL,
    `challenge_rating` INTEGER NULL,
    `xp` INTEGER NOT NULL,
    `abilitiesId` VARCHAR(191) NULL,
    `savingThrowsId` VARCHAR(191) NULL,

    UNIQUE INDEX `Monster_slug_key`(`slug`),
    UNIQUE INDEX `Monster_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ability` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `modifier` VARCHAR(191) NOT NULL,
    `monsterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Action` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `monsterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LegendaryAction` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `monsterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecialAbility` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `monsterId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavingThrows` (
    `id` VARCHAR(191) NOT NULL,
    `STR` VARCHAR(191) NULL,
    `DEX` VARCHAR(191) NULL,
    `CON` VARCHAR(191) NULL,
    `INT` VARCHAR(191) NULL,
    `WIS` VARCHAR(191) NULL,
    `CHA` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GameCharacters` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_GameCharacters_AB_unique`(`A`, `B`),
    INDEX `_GameCharacters_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Monster` ADD CONSTRAINT `Monster_savingThrowsId_fkey` FOREIGN KEY (`savingThrowsId`) REFERENCES `SavingThrows`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ability` ADD CONSTRAINT `Ability_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegendaryAction` ADD CONSTRAINT `LegendaryAction_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpecialAbility` ADD CONSTRAINT `SpecialAbility_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GameCharacters` ADD CONSTRAINT `_GameCharacters_A_fkey` FOREIGN KEY (`A`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GameCharacters` ADD CONSTRAINT `_GameCharacters_B_fkey` FOREIGN KEY (`B`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
