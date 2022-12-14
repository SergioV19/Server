-- CreateTable
CREATE TABLE `autentication` (
    `ID_AUTH` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_USUARIO` INTEGER NOT NULL,
    `CREDENTIAL` CHAR(2) NOT NULL,
    `HASH` VARCHAR(60) NOT NULL,
    `STATE` CHAR(2) NOT NULL,

    INDEX `ID_USUARIO_idx`(`ID_USUARIO`),
    PRIMARY KEY (`ID_AUTH`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historic_usuario` (
    `ID_HISTORIC_USSERS` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_USUARIOS` INTEGER NOT NULL,
    `DATE` DATETIME(0) NOT NULL,
    `IP` VARCHAR(15) NOT NULL,

    INDEX `ID_USUARIO_idx`(`ID_USUARIOS`),
    PRIMARY KEY (`ID_HISTORIC_USSERS`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `ID_ROL` INTEGER NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(50) NOT NULL,
    `DESCRIPTION` VARCHAR(100) NOT NULL,
    `STATE` CHAR(2) NOT NULL,
    `CREATION_DATE` DATETIME(0) NOT NULL,

    PRIMARY KEY (`ID_ROL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ussers_rol` (
    `ID_USSERS_ROL` INTEGER NOT NULL AUTO_INCREMENT,
    `CREATION_DATE` DATETIME(0) NOT NULL,
    `STATE` CHAR(2) NOT NULL,
    `ID_USUARIOS` INTEGER NOT NULL,
    `ID_ROL` INTEGER NOT NULL,

    INDEX `ID_ROL_idx`(`ID_ROL`),
    INDEX `ID_USSUARIO_idx`(`ID_USUARIOS`),
    PRIMARY KEY (`ID_USSERS_ROL`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `ID_USUARIOS` INTEGER NOT NULL AUTO_INCREMENT,
    `NAME` VARCHAR(50) NOT NULL,
    `LAST_NAME` VARCHAR(50) NOT NULL,
    `TYPE_DOCUMENT` CHAR(2) NOT NULL,
    `DOCUMENT` VARCHAR(25) NOT NULL,
    `STATE` CHAR(2) NOT NULL,
    `CREATION_DATE` DATETIME(0) NOT NULL,

    PRIMARY KEY (`ID_USUARIOS`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `autentication` ADD CONSTRAINT `ID_USUARIO` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios`(`ID_USUARIOS`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historic_usuario` ADD CONSTRAINT `ID_USUARIOS` FOREIGN KEY (`ID_USUARIOS`) REFERENCES `usuarios`(`ID_USUARIOS`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ussers_rol` ADD CONSTRAINT `ID_ROL` FOREIGN KEY (`ID_ROL`) REFERENCES `rol`(`ID_ROL`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ussers_rol` ADD CONSTRAINT `ID_USSUARIO` FOREIGN KEY (`ID_USUARIOS`) REFERENCES `usuarios`(`ID_USUARIOS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
