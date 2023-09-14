--pendiente inicializar bbdd desde xampp

-- Tabla de Destinos Turísticos
CREATE TABLE destinos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(255) NOT NULL,
 descripcion TEXT,
 imagen VARCHAR(255),
 precio DECIMAL(10, 2)
);
-- Tabla de Reservas de Viajes
CREATE TABLE reservas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT,
 nombre_cliente VARCHAR(255) NOT NULL,
 correo_cliente VARCHAR(255) NOT NULL,
 fecha_reserva DATE NOT NULL,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);
-- Tabla de Comentarios en Destinos
CREATE TABLE comentarios (
 id INT AUTO_INCREMENT PRIMARY KEY,
 destino_id INT,
 nombre_usuario VARCHAR(255) NOT NULL,
 comentario TEXT NOT NULL,
 fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (destino_id) REFERENCES destinos(id)
);
-- Insert sample data into the "destinos" table
INSERT INTO destinos (nombre, descripcion, imagen, precio)
VALUES
    ('Destination 1', 'Description for Destination 1', 'image1.jpg', 1000.00),
    ('Destination 2', 'Description for Destination 2', 'image2.jpg', 800.50),
    ('Destination 3', 'Description for Destination 3', 'image3.jpg', 1200.75),
    ('Destination 4', 'Description for Destination 4', 'image4.jpg', 950.25),
    ('Destination 5', 'Description for Destination 5', 'image5.jpg', 1100.00),
    ('Destination 6', 'Description for Destination 6', 'image6.jpg', 750.50),
    ('Destination 7', 'Description for Destination 7', 'image7.jpg', 900.25),
    ('Destination 8', 'Description for Destination 8', 'image8.jpg', 1050.75),
    ('Destination 9', 'Description for Destination 9', 'image9.jpg', 850.00),
    ('Destination 10', 'Description for Destination 10', 'image10.jpg', 950.50);

-- Insert sample data into the "reservas" table
INSERT INTO reservas (destino_id, nombre_cliente, correo_cliente, fecha_reserva)
VALUES
    (1, 'John Doe', 'john@example.com', '2023-09-15'),
    (2, 'Alice Johnson', 'alice@example.com', '2023-09-16'),
    (3, 'Michael Williams', 'michael@example.com', '2023-09-17'),
    (4, 'Emily Anderson', 'emily@example.com', '2023-09-18'),
    (5, 'David Martinez', 'david@example.com', '2023-09-19'),
    (6, 'Sarah Jones', 'sarah@example.com', '2023-09-20'),
    (7, 'William Clark', 'william@example.com', '2023-09-21'),
    (8, 'Olivia Taylor', 'olivia@example.com', '2023-09-22'),
    (9, 'James Wilson', 'james@example.com', '2023-09-23'),
    (10, 'Sophia Thomas', 'sophia@example.com', '2023-09-24');
-- Insert sample data into the "comentarios" table
INSERT INTO comentarios (destino_id, nombre_usuario, comentario)
VALUES
    (1, 'User 1', 'Comment for Destination 1'),
    (2, 'User 2', 'Comment for Destination 2'),
    (3, 'User 3', 'Comment for Destination 3'),
    (4, 'User 4', 'Comment for Destination 4'),
    (5, 'User 5', 'Comment for Destination 5'),
    (6, 'User 6', 'Comment for Destination 6'),
    (7, 'User 7', 'Comment for Destination 7'),
    (8, 'User 8', 'Comment for Destination 8'),
    (9, 'User 9', 'Comment for Destination 9'),
    (10, 'User 10', 'Comment for Destination 10');
