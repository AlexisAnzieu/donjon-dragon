-- DropForeignKey
ALTER TABLE `Ability` DROP FOREIGN KEY `Ability_monsterId_fkey`;

-- DropForeignKey
ALTER TABLE `Action` DROP FOREIGN KEY `Action_monsterId_fkey`;

-- DropForeignKey
ALTER TABLE `LegendaryAction` DROP FOREIGN KEY `LegendaryAction_monsterId_fkey`;

-- DropForeignKey
ALTER TABLE `SpecialAbility` DROP FOREIGN KEY `SpecialAbility_monsterId_fkey`;

-- AddForeignKey
ALTER TABLE `Ability` ADD CONSTRAINT `Ability_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Action` ADD CONSTRAINT `Action_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegendaryAction` ADD CONSTRAINT `LegendaryAction_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpecialAbility` ADD CONSTRAINT `SpecialAbility_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `Monster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
