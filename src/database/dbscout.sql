CREATE DATABASE dbscout;

USE dbscout;

--USERS TABLE
CREATE TABLE users(
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    curp VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    sexo VARCHAR(9) NOT NULL,
    fecha_nacimiento date NOT NULL, 
    seccion VARCHAR(1) NOT NULL
);

DESCRIBE users;

--LINKS TABLES
CREATE TABLE links(
 id INT(11) NOT NULL,
 title VARCHAR(150) NOT NULL,
 url VARCHAR(255) NOT NULL,
 description TEXT,
 user_id INT(11),
 created_at timestamp NOT NULL DEFAULT current_timestamp,
 CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE links 
    ADD PRIMARY KEY (id);

ALTER TABLE links
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;


DESCRIBE links;