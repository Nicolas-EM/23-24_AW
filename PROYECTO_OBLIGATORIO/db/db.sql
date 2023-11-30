CREATE TABLE UCM_AW_RIU_USU_Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    grade VARCHAR(255) NOT NULL,
    group VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profileImageName VARCHAR(255),
    profileImageType VARCHAR(255),
    isAdmin BOOLEAN DEFAULT FALSE,
    validated BOOLEAN DEFAULT FALSE,
    UNIQUE (email)
);


CREATE TABLE UCM_AW_RIU_INS_Facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    availabity VARCHAR(255) NOT NULL,
    type VARCHAR(12) NOT NULL,
    capacity INT,
    image BLOB
);

CREATE TABLE UCM_AW_RIU_RES_Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateini DATETIME NOT NULL,
    dateend DATETIME NOT NULL,
    datecreation DATETIME NOT NULL,
    userid INT NOT NULL,
    instid INT NOT NULL,
    FOREIGN KEY (usuid) REFERENCES UCM_AW_RIU_USU_Usuarios(id),
    FOREIGN KEY (instid) REFERENCES UCM_AW_RIU_INS_Instalaciones(id)
);