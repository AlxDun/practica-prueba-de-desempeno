-- Base de datos biblioteca version easy
DROP DATABASE IF EXISTS biblioteca_easy;
CREATE DATABASE biblioteca_easy;
USE biblioteca_easy;

-- Tabla usuarios
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id_usuario int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre_completo varchar(255) NOT NULL,
  numero_de_identificacion varchar(255) NOT NULL,
  correo varchar(100) DEFAULT NULL UNIQUE,
  telefono varchar(100) DEFAULT NULL,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp
) ;

-- Tabla libros
DROP TABLE IF EXISTS libros;
CREATE TABLE libros (
  isbn varchar(100) NOT NULL  PRIMARY KEY,
  titulo varchar(255) NOT NULL,
  año_de_publicacion year DEFAULT NULL,
  autor varchar(100) DEFAULT NULL,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp
);

-- Tabla prestamos
DROP TABLE IF EXISTS prestamos;
CREATE TABLE prestamos (
  id_prestamo int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  isbn varchar(100),
  id_usuario int,
  fecha_prestamo date NOT NULL,
  fecha_devolucion date DEFAULT NULL,
  estado enum('entregado','retrasado','activo') DEFAULT NULL,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp on update current_timestamp,
  
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) on delete set null on update cascade,
  FOREIGN KEY (isbn) REFERENCES libros (isbn) on delete set null on update cascade
);