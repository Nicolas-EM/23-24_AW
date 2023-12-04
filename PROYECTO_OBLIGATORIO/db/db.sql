-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2023 a las 09:50:42
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ucm_riu`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_ins_facilities`
--

CREATE TABLE `ucm_aw_riu_ins_facilities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `availabity` varchar(255) NOT NULL,
  `type` varchar(12) NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  `ImageName` varchar(255) DEFAULT NULL,
  `ImageType` varchar(255) DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `ucm_aw_riu_messages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `sender_id` int(11) NOT NULL,
    `receiver_id` int(11) NOT NULL,
    `message` varchar(255) NOT NULL,
    `timestamp` datetime NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`sender_id`) REFERENCES `ucm_aw_riu_usu_users` (`id`),
    FOREIGN KEY (`receiver_id`) REFERENCES `ucm_aw_riu_usu_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_res_reservations`
--

CREATE TABLE `ucm_aw_riu_res_reservations` (
  `id` int(11) NOT NULL,
  `dateini` datetime NOT NULL,
  `dateend` datetime NOT NULL,
  `datecreation` datetime NOT NULL,
  `userid` int(11) NOT NULL,
  `instid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ucm_aw_riu_usu_users`
--

CREATE TABLE `ucm_aw_riu_usu_users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `ugroup` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profileImageName` varchar(255) DEFAULT NULL,
  `profileImageType` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `validated` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ucm_aw_riu_ins_facilities`
--
ALTER TABLE `ucm_aw_riu_ins_facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ucm_aw_riu_res_reservations`
--
ALTER TABLE `ucm_aw_riu_res_reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `instid` (`instid`);

--
-- Indices de la tabla `ucm_aw_riu_usu_users`
--
ALTER TABLE `ucm_aw_riu_usu_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_ins_facilities`
--
ALTER TABLE `ucm_aw_riu_ins_facilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_res_reservations`
--
ALTER TABLE `ucm_aw_riu_res_reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ucm_aw_riu_usu_users`
--
ALTER TABLE `ucm_aw_riu_usu_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ucm_aw_riu_res_reservations`
--
ALTER TABLE `ucm_aw_riu_res_reservations`
  ADD CONSTRAINT `ucm_aw_riu_res_reservations_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `ucm_aw_riu_usu_users` (`id`),
  ADD CONSTRAINT `ucm_aw_riu_res_reservations_ibfk_2` FOREIGN KEY (`instid`) REFERENCES `ucm_aw_riu_ins_facilities` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- Insert entries into ucm_aw_riu_ins_facilities table

-- Insert entries into ucm_aw_riu_usu_users table
INSERT INTO ucm_aw_riu_usu_users (name, surname, faculty, grade, ugroup, email, password, profileImageName, profileImageType, isAdmin, validated) VALUES
('John', 'Doe', 'Faculty 1', 'Grade 1', 'Group 1', 'john.doe@example.com', 'password1', NULL, NULL, 0, 1),
('Jane', 'Smith', 'Faculty 2', 'Grade 2', 'Group 2', 'jane.smith@example.com', 'password2', NULL, NULL, 1, 1),
('Mike', 'Johnson', 'Faculty 3', 'Grade 3', 'Group 3', 'mike.johnson@example.com', 'password3', NULL, NULL, 0, 1);

INSERT INTO ucm_aw_riu_ins_facilities (name, availabity, type, capacity, image) VALUES
('Facility 1', 'Available', 'Type 1', 100, NULL),
('Facility 2', 'Not Available', 'Type 2', 50, NULL),
('Facility 3', 'Available', 'Type 1', 200, NULL);

-- Insert entries into ucm_aw_riu_res_reservations table
INSERT INTO ucm_aw_riu_res_reservations (dateini, dateend, datecreation, userid, instid) VALUES
('2023-12-01 10:00:00', '2023-12-01 12:00:00', '2023-12-01 09:30:00', 1, 1),
('2023-12-02 14:00:00', '2023-12-02 16:00:00', '2023-12-02 13:30:00', 2, 2),
('2023-12-03 09:00:00', '2023-12-03 11:00:00', '2023-12-03 08:30:00', 3, 3);

INSERT INTO ucm_aw_riu_messages (sender_id, receiver_id, message, timestamp) VALUES
(1, 2, 'Hello Jane, how are you?', '2023-12-01 10:30:00'),
(2, 1, 'Hi John, Im doing great. How about you?', '2023-12-01 10:35:00'),
(1, 2, 'Im good too. Just working on some projects.', '2023-12-01 10:40:00'),
(2, 1, 'Thats great. Let me know if you need any help.', '2023-12-01 10:45:00');
