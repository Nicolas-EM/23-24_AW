DROP DATABASE IF EXISTS UCM_RIU;

CREATE DATABASE UCM_RIU;

USE UCM_RIU;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'admin_aw'@'localhost' WITH GRANT OPTION;

CREATE TABLE `ucm_aw_riu_ins_facilities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `availabity` varchar(255) NOT NULL,
  `type` varchar(12) NOT NULL,
  `capacity` INT DEFAULT NULL,
  `ImageName` varchar(255) DEFAULT NULL,
  `ImageType` varchar(255) DEFAULT NULL
);

CREATE TABLE `ucm_aw_riu_res_reservations` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `dateini` datetime NOT NULL,
  `dateend` datetime NOT NULL,
  `datecreation` datetime NOT NULL,
  `userid` INT NOT NULL,
  `instid` INT NOT NULL
);

CREATE TABLE `ucm_aw_riu_usu_users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
);

CREATE TABLE `ucm_aw_riu_messages` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `sender_id` INT NOT NULL,
    `receiver_id` INT NOT NULL,
    `message` varchar(255) NOT NULL,
    `timestamp` datetime NOT NULL,
    FOREIGN KEY (`sender_id`) REFERENCES `ucm_aw_riu_usu_users` (`id`),
    FOREIGN KEY (`receiver_id`) REFERENCES `ucm_aw_riu_usu_users` (`id`)
);

-- Insert entries into ucm_aw_riu_usu_users table
INSERT INTO ucm_aw_riu_usu_users (name, surname, faculty, grade, ugroup, email, password, profileImageName, profileImageType, isAdmin, validated) VALUES
('Normal', 'User', 'Faculty 1', 'Grade 1', 'Group 1', 'user@ucm.es', "$2b$10$8/kCVjZ8pJsleqFs0Qah4e9eOMPycwOC6Jfvc3k.biMtzvpC5iAnS", NULL, NULL, 0, 1),
('Admin', 'User', 'Faculty 2', 'Grade 2', 'Group 2', 'admin@ucm.es', "$2b$10$8/kCVjZ8pJsleqFs0Qah4e9eOMPycwOC6Jfvc3k.biMtzvpC5iAnS", NULL, NULL, 1, 1),
('Mike', 'Johnson', 'Faculty 3', 'Grade 3', 'Group 3', 'user3@ucm.es', "$2b$10$8/kCVjZ8pJsleqFs0Qah4e9eOMPycwOC6Jfvc3k.biMtzvpC5iAnS", NULL, NULL, 0, 1);

INSERT INTO ucm_aw_riu_ins_facilities (name, availabity, type, capacity) VALUES
('Facility 1', 'Available', 'Type 1', 100),
('Facility 2', 'Not Available', 'Type 2', 50),
('Facility 3', 'Available', 'Type 1', 200);

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
