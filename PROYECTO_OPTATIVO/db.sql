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
--jajajaj cambiar la foto anda
insert into destinos (nombre, descripcion, imagen, precio) 
values ('Islas Bahamas', 'Disfruta de un periodo vacacional paradisíaco en las Islas Bahamas, con un clima idílico y un precio lúdico.',
 'https://www.viajes.carrefour.es/blog/wp-content/uploads/2019/07/islas-bahamas.jpg',
 500);