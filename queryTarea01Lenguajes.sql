
/**
USE preguntados;

CREATE TABLE table_usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE table_preguntas (
    id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(255) NOT NULL,
    respuesta_incorrecta_uno VARCHAR(255) NOT NULL,
    respuesta_incorrecta_dos VARCHAR(255) NOT NULL,
    respuesta_incorrecta_tres VARCHAR(255) NOT NULL,
    respuesta_correcta VARCHAR(255) NOT NULL
);



CREATE TABLE table_historial (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correctas INT DEFAULT 0
);


INSERT INTO table_preguntas (pregunta, respuesta_incorrecta_uno, respuesta_incorrecta_dos, respuesta_incorrecta_tres, respuesta_correcta) VALUES
('¿Qué significa HTML?', 'HighText Machine Language', 'HyperTransfer Markup Language', 'HyperText Markdown Language', 'HyperText Markup Language'),
('¿Qué es un SSD?', 'Super Speed Disk', 'Standard Storage Device', 'Super Secure Disk', 'Solid State Drive'),
('¿Quién es el fundador de Microsoft?', 'Steve Jobs', 'Mark Zuckerberg', 'Larry Page', 'Bill Gates'),
('¿Qué lenguaje se utiliza principalmente para crear aplicaciones de iOS?', 'Python', 'Kotlin', 'Ruby', 'Swift'),
('¿Qué significa CPU?', 'Computer Processing Unit', 'Central Power Unit', 'Computer Power Unit', 'Central Processing Unit'),
('¿Cuál es el navegador web desarrollado por Google?', 'Firefox', 'Safari', 'Edge', 'Chrome'),
('¿Qué empresa fabrica los procesadores Ryzen?', 'Intel', 'Nvidia', 'Qualcomm', 'AMD'),
('¿Cuál es el sistema operativo más utilizado en servidores?', 'Windows 10', 'macOS', 'Android', 'Linux'),
('¿Qué significa IoT?', 'Internet of Tools', 'Information on Technology', 'Internet of Text', 'Internet of Things'),
('¿Qué es GitHub?', 'Un motor de búsqueda', 'Un lenguaje de programación', 'Un sistema operativo', 'Una plataforma para control de versiones y colaboración'),
('¿Qué lenguaje de programación es conocido por su uso en inteligencia artificial?', 'HTML', 'CSS', 'PHP', 'Python'),
('¿Qué significa URL?', 'Unified Resource Locator', 'Universal Resource Locator', 'Uniform Retrieval Locator', 'Uniform Resource Locator'),
('¿Cuál es el formato de compresión de imágenes más común en la web?', 'GIF', 'PNG', 'BMP', 'JPEG'),
('¿Qué empresa desarrolló el sistema operativo Android?', 'Apple', 'Microsoft', 'IBM', 'Google'),
('¿Qué es un Firewall?', 'Un tipo de malware', 'Un software antivirus', 'Un navegador web', 'Un sistema de seguridad de red');
ALTER TABLE table_preguntas ADD COLUMN usada BOOLEAN DEFAULT FALSE;

**/
USE preguntados;

SELECT * FROM table_historial ORDER BY nombre;

SELECT * FROM table_usuarios;


DELETE FROM table_usuarios;
ALTER TABLE table_usuarios AUTO_INCREMENT = 1;


DELETE FROM table_historial;

SELECT * FROM table_preguntas;
