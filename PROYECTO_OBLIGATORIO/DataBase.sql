--tablas generadas en base a las consultas que nos daban...
--para conectarse:
-- Esto debe ser así para examen tb: 
-- mysqlConfig: {host: "localhost",user: "root",password: "",database: "UCM_RIU",port: 3306}

--Users Table
CREATE TABLE UCM_AW_RIU_USU_Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    apellido1 VARCHAR(255),
    apellido2 VARCHAR(255)
);

--Installations Table
CREATE TABLE UCM_AW_RIU_INS_Instalaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    tipoReserva VARCHAR(255)
);

--Reservations Table
CREATE TABLE UCM_AW_RIU_RES_Reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuId INT,
    instId INT,
    fecha DATE,
    FOREIGN KEY (usuId) REFERENCES UCM_AW_RIU_USU_Usuarios(id),
    FOREIGN KEY (instId) REFERENCES UCM_AW_RIU_INS_Instalaciones(id)
);
