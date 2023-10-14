-- SQL file for our db
DROP DATABASE IF EXISTS viajes;

CREATE DATABASE viajes;

USE viajes;

CREATE TABLE destinos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(255) NOT NULL,
 descripcion TEXT,
 imagen TEXT,
 precio DECIMAL(10, 2)
);
--insert id only on create, then hash the id AND password
CREATE TABLE usuarios(
id INT AUTO_INCREMENT,
hash_id AS HASHBYTES('SHA1', CONVERT(VARCHAR(12), id)) PRIMARY KEY,
nombre VARCHAR(255) NOT NULL,
correo VARCHAR(255) NOT NULL,
passwd VARCHAR(255) NOT NULL
);
CREATE TABLE reservas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT,
 nombre_cliente VARCHAR(255) NOT NULL,
 correo_cliente VARCHAR(255) NOT NULL,
 fecha_reserva DATE NOT NULL,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

CREATE TABLE comentarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT,
 nombre_usuario VARCHAR(255) NOT NULL,
 comentario TEXT NOT NULL,
 fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

insert into destinos (nombre, descripcion, imagen, precio) 
values ('Islas Bahamas', 'Disfruta de un periodo vacacional paradisíaco en las Islas Bahamas, con un clima idílico y un precio lúdico.','vacation_1.jpg',500),
('Noruega','Quédate maravillado con las vistas del cielo boreal desde nuestra suite en Noruega.','vacation_2.jpg',1000),
('Puerto Rico','Disfruta de la cultura y la gastronomía de Puerto Rico, así como sus impresionantes mares.','vacation_3.jpg',800),
('Arizona, EEUU','Visita el Gran Cañón del Colorado y disfruta de la naturaleza en su estado más puro.','vacation_4.jpg',350),
('Extremadura','Visita la increíble estepa castellana, con los atardeceres de oro','vacation_5.jpg',900),
('Irlanda','Visita la tierra de los duendes y los leprechauns, y disfruta de la cerveza más famosa del mundo.','vacation_6.jpg',600),
('Nueva York','Visita la ciudad que nunca duerme, y disfruta de la cultura y la gastronomía de la Gran Manzana.','vacation_7.jpg',1200),
('Nueva Zelanda','Visita la tierra de los kiwis y los maoríes, y disfruta de la naturaleza más salvaje.','vacation_8.jpg',1500),
('Tailandia','Visita el país de las sonrisas, y disfruta de la cultura y la gastronomía de Tailandia.','vacation_9.jpg',1000),
('Toscana','Visita la tierra de la pasta y el vino, y disfruta de la cultura y la gastronomía de la Toscana.','vacation_10.jpg',800),
('Venecia','Visita la ciudad de los canales, y disfruta de la cultura y la gastronomía de Venecia.','vacation_11.jpg',700),
('Vietnam','Visita el país de los dragones, y disfruta de la cultura y la gastronomía de Vietnam.','vacation_12.jpg',900),
('Himalaya','Visita la tierra de los monjes, y disfruta de la cultura y la gastronomía del Himalaya.','vacation_13.jpg',1200),
('Escandinavia','Visita la tierra de los vikingos, y disfruta de la cultura y la gastronomía de Escandinavia.','vacation_14.jpg',1000),
('Perú','Visita la tierra de los incas, y disfruta de la cultura y la gastronomía de Perú.','vacation_15.jpg',800);