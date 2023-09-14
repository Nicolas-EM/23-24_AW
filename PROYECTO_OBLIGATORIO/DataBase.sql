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
-- Insert sample data into Users Table
INSERT INTO UCM_AW_RIU_USU_Usuarios (nombre, apellido1, apellido2)
VALUES
    ('John', 'Doe', 'Smith'),
    ('Alice', 'Johnson', 'Brown'),
    ('Michael', 'Williams', 'Lee'),
    ('Emily', 'Anderson', 'White'),
    ('David', 'Martinez', 'Johnson'),
    ('Sarah', 'Jones', 'Davis'),
    ('William', 'Clark', 'Thomas'),
    ('Olivia', 'Taylor', 'Moore'),
    ('James', 'Wilson', 'Evans'),
    ('Sophia', 'Thomas', 'Harris');

-- Insert sample data into Installations Table
INSERT INTO UCM_AW_RIU_INS_Instalaciones (nombre, tipoReserva)
VALUES
    ('Sala de Estudio #1', 'Fitness'),
    ('Sala de Estudio #2', 'Sports'),
    ('Sala de Estudio #3', 'Recreation'),
    ('Sala de Estudio #4', 'Conference'),
    ('Basketball Court', 'Sports'),
    ('Spa', 'Recreation'),
    ('Cinema Room', 'Entertainment'),
    ('Yoga Studio', 'Fitness'),
    ('Game Room', 'Entertainment'),
    ('Soccer Field', 'Sports');

-- Insert sample data into Reservations Table
-- Assume there are 10 users and 10 installations, and each user reserves one installation on different dates
INSERT INTO UCM_AW_RIU_RES_Reservas (usuId, instId, fecha)
VALUES
    (1, 1, '2023-09-15'),
    (2, 2, '2023-09-16'),
    (3, 3, '2023-09-17'),
    (4, 4, '2023-09-18'),
    (5, 5, '2023-09-19'),
    (6, 6, '2023-09-20'),
    (7, 7, '2023-09-21'),
    (8, 8, '2023-09-22'),
    (9, 9, '2023-09-23'),
    (10, 10, '2023-09-24');
