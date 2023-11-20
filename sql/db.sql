CREATE SCHEMA IF NOT EXISTS `clothingStoreOnlineSolvd`;
USE `clothingStoreOnlineSolvd`;


CREATE TABLE IF NOT EXISTS `clothingStoreOnlineSolvd`.`user` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `dateOfBirth` DATE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` BLOB NULL DEFAULT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`userId`),
  UNIQUE INDEX `userId_UNIQUE` (`userId` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

CREATE TABLE IF NOT EXISTS `clothingStoreOnlineSolvd`.`product` (
  `productId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `userId` INT NOT NULL,
  `stock` INT NOT NULL DEFAULT '0',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`),
  INDEX `userId_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `userId`
    FOREIGN KEY (`userId`)
    REFERENCES `clothingStoreOnlineSolvd`.`user` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `clothingStoreOnlineSolvd`.`image` (
  `imageId` INT NOT NULL AUTO_INCREMENT,
  `href` VARCHAR(255) NOT NULL,
  `data` BLOB NOT NULL,
  `productId` INT NOT NULL,
  PRIMARY KEY (`imageId`),
  UNIQUE INDEX `imageId_UNIQUE` (`imageId` ASC) VISIBLE,
  INDEX `productId_idx` (`productId` ASC) VISIBLE,
  CONSTRAINT `productId`
    FOREIGN KEY (`productId`)
    REFERENCES `clothingStoreOnlineSolvd`.`product` (`productId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

