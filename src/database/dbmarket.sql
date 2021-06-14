CREATE DATABASE PAN_LUIS2;

USE PAN_LUIS2;

CREATE TABLE users(
    id INT(10) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
	nombre VARCHAR(50) NOT NULL,
	apellidos VARCHAR(50) NOT NULL,
    tipo_usuario int(1) NOT NULL
);

ALTER TABLE tiendas ADD PRIMARY KEY (id_tienda);
ALTER TABLE actividad ADD PRIMARY KEY (id_act);

ALTER TABLE tiendas MODIFY id_tienda INT(10) NOT NULL AUTO_INCREMENT;

DESCRIBE users;

CREATE TABLE productos(
 id INT(10) NOT NULL,
 nombre VARCHAR(50) NOT NULL,
 description TEXT,
 precio VARCHAR(20) NOT NULL,
 user_id INT(10),
 created_at timestamp NOT NULL DEFAULT current_timestamp,
 CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tiendas(
 id_tienda INT(10) NOT NULL primary key auto_increment,
 nombre_tienda VARCHAR(50) NOT NULL,
 description TEXT,
 url varchar(100) NOT NULL,
 user_id INT(10),
 CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE actividad(
 id_act INT(10) NOT NULL PRIMARY KEY AUTO_INCREMENT,
 tienda_visitada VARCHAR(50) NOT NULL,
 user_id VARCHAR(50) NOT NULL,
 ip VARCHAR(50) NOT NULL,
 tiempo timestamp NOT NULL DEFAULT current_timestamp
);

ALTER TABLE productos 
    ADD PRIMARY KEY (id);

ALTER TABLE actividad MODIFY id_act INT(10) NOT NULL AUTO_INCREMENT;
ALTER TABLE tiendas MODIFY id_tienda INT(10) NOT NULL AUTO_INCREMENT;

alter table users modify username varchar(50) not null UNIQUE;
alter table users modify intentos int(1) not null;

alter table users add reportado varchar(50);
alter table users add intentos int(1);

DESCRIBE sessions;

UPDATE users set reportado = "bloqueado" WHERE id = "16";
UPDATE users set reportado = "activo" WHERE id = "16";
UPDATE users set intentos = "0" WHERE id = "16";
insert into users (reportado) values ("bloqueado") where id = "";

select * from actividad;
select * from users;
select * from tiendas;

describe actividad

truncate actividad;

DESCRIBE pan_luis2;