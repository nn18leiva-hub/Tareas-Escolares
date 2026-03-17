-- Create the database if we run manually, but here we just create tables
DROP DATABASE IF EXISTS stuplan;
CREATE DATABASE stuplan;
\c stuplan;

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE periodos (
    id_periodo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE materias (
    id_materia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    profesor VARCHAR(100),
    id_periodo INT REFERENCES periodos(id_periodo) ON DELETE CASCADE
);

CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_materia INT REFERENCES materias(id_materia) ON DELETE CASCADE
);

CREATE TABLE tareas (
    id_tarea SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATE NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    id_materia INT REFERENCES materias(id_materia) ON DELETE CASCADE
);
