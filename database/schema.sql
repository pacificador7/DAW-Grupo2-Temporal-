CREATE TABLE tareas (
    id          BIGSERIAL PRIMARY KEY,
    titulo      VARCHAR(150) NOT NULL,
    descripcion TEXT,
    estado      VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE',
    responsable VARCHAR(100),
    fecha_limite DATE
);