# Gestión de Tareas y Proyectos

## Descripción del Proyecto
Sistema web para la gestión de tareas y proyectos que permite crear, listar, editar y eliminar tareas. Desarrollado con una arquitectura Cliente-Servidor desacoplada: el backend expone una API REST documentada con Swagger, el frontend consume esa API desde React, y todo el sistema se orquesta con Docker Compose.

## Integrantes
| Nombre | Carnet |
|--------|--------|
| Ghilmer Eduardo De La Cruz Ventura | DV24003 |
| Bryan Jose Moreno Villanueva | MV24050 |
| Jose Fabricio Reyes Sermeno | RS24033 |
| Juan Jose Recinos Murgas | RM24009 |
| Alan Josue Menendez Hidalgo | MH23001 |

## Repositorio
[https://github.com/pacificador7/Gestion-de-Tareas-y-Proyectos](https://github.com/pacificador7/Gestion-de-Tareas-y-Proyectos)

---

## Diagrama Entidad-Relación
![Diagrama ER](database/Diagrama-ER.png)

### Script SQL
```sql
CREATE TABLE tareas (
    id           BIGSERIAL PRIMARY KEY,
    titulo       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    estado       VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE',
    responsable  VARCHAR(100),
    fecha_limite DATE
);
```

---

## Estructura del Repositorio
```
Gestion-de-Tareas-y-Proyectos/
├── backend/          # API REST con Spring Boot
├── frontend/         # SPA desarrollada en React
├── database/         # Script SQL y diagrama ER
├── docker-compose.yml
└── README.md
```

---

## Tecnologías Utilizadas
### Backend
- Java 21
- Spring Boot 3.5.13
- Spring Web / Spring Data JPA
- PostgreSQL Driver
- Lombok
- Springdoc OpenAPI / Swagger UI 2.5.0

### Frontend
- React 18 (Vite)
- Axios
- JavaScript ES6+

### Base de Datos
- PostgreSQL 14+

### Despliegue
- Docker
- Docker Compose

---

## API REST — Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tareas` | Listar todas las tareas |
| GET | `/tareas/{id}` | Obtener tarea por ID |
| POST | `/tareas` | Crear nueva tarea |
| PUT | `/tareas/{id}` | Actualizar tarea existente |
| DELETE | `/tareas/{id}` | Eliminar tarea |

### Ejemplo JSON
```json
{
  "titulo": "Preparar entrega",
  "descripcion": "Documentar avances del laboratorio",
  "estado": "PENDIENTE",
  "responsable": "Alan",
  "fechaLimite": "2026-05-30"
}
```

---

## Manual de Despliegue con Docker

### Requisitos previos
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Tener el repositorio clonado

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/pacificador7/Gestion-de-Tareas-y-Proyectos.git
cd Gestion-de-Tareas-y-Proyectos
```

**2. Levantar todo el sistema con un solo comando**
```bash
docker-compose up --build
```
<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/762feeb9-ab9b-442c-8a73-aab29bb4c1c8" />


Este comando levanta los 3 servicios:
- **PostgreSQL** en el puerto `5432`
- **Backend** (Spring Boot) en el puerto `8080`
- **Frontend** (React) en el puerto `5173`
<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/f1960ddb-ab22-48c6-9969-111a51b2d0dc" />

**3. Acceder a la aplicación**
| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/tareas |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |

**4. Detener el sistema**
```bash
docker-compose down
```

---

## Ejecución sin Docker (desarrollo local)

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Evidencias de Funcionamiento

### Swagger UI
![Swagger UI](database/swagger.png)

### Vistas de la aplicación
![Listado de Tareas](database/vista-get.png)
![Crear Tarea](database/vista-post.png)
![Editar Tarea](database/vista-put.png)
![Eliminar Tarea](database/vista-delete.png)

---

## Licencia
Uso académico — Desarrollo de Aplicaciones Web (DAW), Universidad de El Salvador.
