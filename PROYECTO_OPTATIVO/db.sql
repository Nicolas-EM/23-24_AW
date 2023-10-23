-- SQL file for our db
DROP DATABASE IF EXISTS viajes;

CREATE DATABASE viajes;

USE viajes;

CREATE USER IF NOT EXISTS 'admin_aw'@'localhost' IDENTIFIED BY '';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'admin_aw'@'localhost' WITH GRANT OPTION;

CREATE TABLE destinos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(255) NOT NULL,
 descripcion TEXT NOT NULL,
 precio DECIMAL(10, 2) NOT NULL
);

CREATE TABLE destino_imagenes (
 image_id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT NOT NULL,
 img_description TEXT NOT NULL,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

CREATE INDEX idx_destino_id ON destino_imagenes (destino_id);

CREATE TABLE usuarios(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(255) NOT NULL,
correo VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
UNIQUE (correo)
);

CREATE TABLE reservas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT NOT NULL,
 cliente_id INT NOT NULL,
 fecha_start DATE NOT NULL,
 fecha_end DATE NOT NULL,
 FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

CREATE TABLE comentarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT NOT NULL,
 nombre_usuario VARCHAR(255) NOT NULL,
 comentario TEXT NOT NULL,
 fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

INSERT INTO destinos (nombre, descripcion, precio) 
VALUES 
('Islas Bahamas', 'Disfruta de un periodo vacacional paradisíaco en las Islas Bahamas, con un clima idílico y un precio lúdico.', 500),
('Noruega', 'Quédate maravillado con las vistas del cielo boreal desde nuestra suite en Noruega.', 1000),
('Puerto Rico', 'Disfruta de la cultura y la gastronomía de Puerto Rico, así como sus impresionantes mares.', 800),
('Arizona, EEUU', 'Visita el Gran Cañón del Colorado y disfruta de la naturaleza en su estado más puro.', 350),
('Extremadura', 'Visita la increíble estepa castellana, con los atardeceres de oro', 900),
('Irlanda', 'Visita la tierra de los duendes y los leprechauns, y disfruta de la cerveza más famosa del mundo.', 600),
('Nueva York', 'Visita la ciudad que nunca duerme, y disfruta de la cultura y la gastronomía de la Gran Manzana.', 1200),
('Nueva Zelanda', 'Visita la tierra de los kiwis y los maoríes, y disfruta de la naturaleza más salvaje.', 1500),
('Tailandia', 'Visita el país de las sonrisas, y disfruta de la cultura y la gastronomía de Tailandia.', 1000),
('Toscana', 'Visita la tierra de la pasta y el vino, y disfruta de la cultura y la gastronomía de la Toscana.', 800),
('Venecia', 'Visita la ciudad de los canales, y disfruta de la cultura y la gastronomía de Venecia.', 700),
('Vietnam', 'Visita el país de los dragones, y disfruta de la cultura y la gastronomía de Vietnam.', 900),
('Himalaya', 'Visita la tierra de los monjes, y disfruta de la cultura y la gastronomía del Himalaya.', 1200),
('Escandinavia', 'Visita la tierra de los vikingos, y disfruta de la cultura y la gastronomía de Escandinavia.', 1000),
('Perú', 'Visita la tierra de los incas, y disfruta de la cultura y la gastronomía de Perú.', 800);

-- Generate random image filenames for each destination
INSERT INTO destino_imagenes (destino_id, img_description)
SELECT
  d.id AS destino_id,
  CONCAT('Image for destination', d.id) AS img_description
FROM destinos d
CROSS JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) AS rand_images;
