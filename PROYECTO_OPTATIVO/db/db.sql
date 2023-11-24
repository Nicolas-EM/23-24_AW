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

INSERT INTO usuarios VALUES (1, "Prueba", "test@ucm.es", "$2b$10$8/kCVjZ8pJsleqFs0Qah4e9eOMPycwOC6Jfvc3k.biMtzvpC5iAnS");

CREATE TABLE reservas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT NOT NULL,
 cliente_id INT NOT NULL,
 fecha_start DATE NOT NULL,
 fecha_end DATE NOT NULL,
 reviewed BOOLEAN DEFAULT FALSE,
 FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);

CREATE TABLE comentarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT NOT NULL,
 nombre_usuario VARCHAR(255) NOT NULL,
 comentario TEXT NOT NULL,
 puntuacion INT NOT NULL,
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

INSERT INTO reservas (destino_id, cliente_id, fecha_start, fecha_end)
VALUES
  (1, 1, '2020-07-01', '2020-07-07'),
  (5, 1, '2020-08-15', '2020-08-22'),
  (10, 1, '2020-09-10', '2020-09-15'),
  (15, 1, '2020-10-20', '2020-10-25'),
  (2, 1, '2024-07-01', '2024-07-07'),
  (6, 1, '2024-08-15', '2024-08-22'),
  (11, 1, '2024-09-10', '2024-09-15'),
  (14, 1, '2024-10-20', '2024-10-25');

-- Generate random image filenames for each destination
INSERT INTO destino_imagenes (destino_id, img_description)
SELECT
  d.id AS destino_id,
  CONCAT('Image for destination', d.id) AS img_description
FROM destinos d
CROSS JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) AS rand_images;
-- un poco bruto, pero es solamente para testear
INSERT INTO comentarios (destino_id, nombre_usuario, comentario, puntuacion)
VALUES
  (1, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN '¡Este destino es increíble! ¡Me encantó!' ELSE 'Este destino es una decepción total, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (1, 'Jesus, el señor', CASE WHEN RAND() < 0.5 THEN 'Muy mal destino, no lo recomiendo.' ELSE '¡Maravilloso lugar para unas vacaciones inolvidables!' END, FLOOR(1 + RAND() * 5)),
  (1, 'Otro Usuario', CASE WHEN RAND() < 0.5 THEN 'Nada especial, mejor busca otro destino.' ELSE 'Me quedé impresionado por la belleza de este lugar.' END, FLOOR(1 + RAND() * 5)),
  (2, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Noruega es asombrosa, una experiencia única.' ELSE 'Decepcionante viaje, no vale la pena.' END, FLOOR(1 + RAND() * 5)),
  (2, 'Jesus, el señor', CASE WHEN RAND() < 0.5 THEN 'Recomiendo Noruega a todos, es mágica.' ELSE 'No cumplió mis expectativas, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (3, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Puerto Rico es un paraíso terrenal.' ELSE 'Puerto Rico no es lo que esperaba, me decepcionó.' END, FLOOR(1 + RAND() * 5)),
  (4, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Arizona, EEUU, es un lugar impresionante.' ELSE 'Me aburrí en Arizona, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (4, 'Jesus, el señor', CASE WHEN RAND() < 0.5 THEN 'Increíbles paisajes en Arizona.' ELSE 'No disfruté mi viaje a Arizona, esperaba más.' END, FLOOR(1 + RAND() * 5)),
  (5, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Extremadura tiene su encanto, pero hay opciones mejores.' ELSE 'Gran decepción en Extremadura, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (6, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Irlanda es un lugar mágico.' ELSE 'Irlanda no cumplió mis expectativas, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (7, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Nueva York, la ciudad que nunca duerme.' ELSE 'Nueva York me pareció caótico, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (8, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Nueva Zelanda, un destino de ensueño.' ELSE 'No disfruté mi viaje a Nueva Zelanda, esperaba más.' END, FLOOR(1 + RAND() * 5)),
  (8, 'Jesus, el señor', CASE WHEN RAND() < 0.5 THEN 'Nueva Zelanda es un paraíso natural.' ELSE 'Nueva Zelanda no cumplió mis expectativas, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (9, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Tailandia es un viaje inolvidable.' ELSE 'Tailandia no me impresionó, hay mejores opciones.' END, FLOOR(1 + RAND() * 5)),
  (10, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'La Toscana es un lugar encantador.' ELSE 'Me decepcionó la Toscana, esperaba más.' END, FLOOR(1 + RAND() * 5)),
  (11, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Venecia, la ciudad de los canales.' ELSE 'Venecia no cumplió mis expectativas, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (12, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Vietnam es un destino fascinante.' ELSE 'Vietnam no me impresionó, hay mejores opciones.' END, FLOOR(1 + RAND() * 5)),
  (12, 'Jesus, el señor', CASE WHEN RAND() < 0.5 THEN 'Vietnam es una experiencia única.' ELSE 'Me aburrí en Vietnam, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (13, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'El Himalaya es un lugar espiritual.' ELSE 'El Himalaya no cumplió mis expectativas, no lo recomiendo.' END, FLOOR(1 + RAND() * 5)),
  (14, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Escandinavia es un viaje cultural.' ELSE 'Me decepcionó Escandinavia, esperaba más.' END, FLOOR(1 + RAND() * 5)),
  (15, 'Mr Cáceres', CASE WHEN RAND() < 0.5 THEN 'Perú, tierra de los incas.' ELSE 'Perú no me impresionó, hay mejores opciones.' END, FLOOR(1 + RAND() * 5));