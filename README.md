# Laboratorio 1 DAW - Gestion De Tareas Y Proyectos

## Descripcion General
Aplicacion web de gestion de tareas desarrollada por equipo, con backend en Spring Boot + PostgreSQL y frontend en HTML/CSS/JavaScript.

Estado actual del proyecto:
- Backend REST funcional con CRUD de tareas.
- Conexion a PostgreSQL configurada.
- Frontend estatico funcional.
- Simulacion CRUD en frontend (en memoria) para pruebas de interfaz.
- Mejoras responsive para desktop y logica de mostrar/ocultar formularios.

## Integrantes
- Ghilmer Eduardo De La Cruz Ventura - DV24003
- Bryan Jose Moreno Villanueva - MV24050
- Jose Fabricio Reyes Sermeno - RS24033
- Juan Jose Recinos Murgas - RM24009
- Alan Josue Menendez Hidalgo - MH23001

## Estructura Del Proyecto
```text
Proyecto-Daw/
|-- backend/        # API REST Spring Boot
|-- frontend/       # Interfaz web (HTML/CSS/JS)
|-- database/       # Script SQL base
`-- README.md
```

## Requerimientos
### Backend
- Java 21
- Maven (incluye wrapper `mvnw`/`mvnw.cmd`)
- PostgreSQL 14+ (recomendado)

### Frontend
- Navegador moderno (Chrome, Edge, Firefox)
- Opcional: servidor estatico local (Live Server, etc.)

## Tecnologias Usadas
- Spring Boot `3.5.13`
- Spring Web
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- OpenAPI/Swagger (`springdoc-openapi-starter-webmvc-ui:2.5.0`)
- HTML5, CSS3, JavaScript (vanilla)

## Configuracion De Base De Datos
### 1. Crear base de datos
Desde `psql`:
```sql
CREATE DATABASE tareas_db;
```

### 2. Script SQL (opcional)
Archivo: `database/schema.sql`
```sql
CREATE TABLE tareas (
    id           BIGSERIAL PRIMARY KEY,
    titulo       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    estado       VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    responsable  VARCHAR(100),
    fecha_limite DATE
);
```

### 3. Configurar credenciales
Archivo: `backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tareas_db
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Nota: si la contrasena no coincide con tu instalacion local, el backend falla con error de autenticacion de PostgreSQL.

## Como Ejecutar El Proyecto
## 1) Backend
En terminal:
```bash
cd backend
./mvnw spring-boot:run
```
En Windows:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend disponible en:
- `http://localhost:8080`

Importante:
- La raiz `/` puede devolver `404` (Whitelabel) porque no existe vista en backend.
- Endpoint principal actual: `/tareas`.

## 2) Frontend
Abrir directamente:
- `frontend/index.html`

O servirlo con servidor local para mejor experiencia.

## API Actual (Backend)
Controlador base: `/tareas`

- `GET /tareas` -> listar tareas
- `GET /tareas/{id}` -> obtener tarea por ID
- `POST /tareas` -> crear tarea
- `PUT /tareas/{id}` -> actualizar tarea
- `DELETE /tareas/{id}` -> eliminar tarea

### Ejemplo JSON para crear/actualizar
```json
{
  "titulo": "Preparar entrega",
  "descripcion": "Documentar avances del laboratorio",
  "estado": "PENDIENTE",
  "responsable": "Alan",
  "fechaLimite": "2026-05-30"
}
```

## Swagger / Documentacion API
Si el backend esta encendido, revisar:
- `http://localhost:8080/swagger-ui/index.html`

## Avance Del Frontend Hasta Hoy
Archivo principal: `frontend/index.html`

### Funcionalidades implementadas
- Renderizado de listado de tareas con datos mock.
- Formulario de creacion con validaciones.
- Formulario de edicion por ID con carga de datos.
- Eliminacion por ID con modal de confirmacion.
- Mensajes visuales de exito/error.

### Mejoras recientes (parte de Responsive Desktop + logica JS)
- Media query desktop agregada para mejorar distribucion de secciones en pantallas grandes.
- Botones dinamicos para mostrar/ocultar formularios de:
  - Crear
  - Editar
  - Eliminar
- CRUD simulado en memoria conectado a la tabla:
  - Agregar
  - Editar
  - Eliminar

## Licencia
Uso academico para Laboratorio 1 - Desarrollo de Aplicaciones Web (DAW).
