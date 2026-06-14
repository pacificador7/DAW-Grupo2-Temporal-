import axios from 'axios';

// Instancia base de Axios apuntando al backend Spring Boot.
// En desarrollo, Vite hace proxy de /tareas -> http://localhost:8080/tareas
// para evitar errores de CORS (ver vite.config.js).
const api = axios.create({
  baseURL: '/tareas',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── GET ──────────────────────────────────────────────────────────────────────

/** Obtiene el listado completo de tareas */
export const getTareas = () => api.get('/');

/** Obtiene una tarea por su ID */
export const getTareaById = (id) => api.get(`/${id}`);

// ─── POST ─────────────────────────────────────────────────────────────────────

/**
 * Crea una nueva tarea.
 * @param {{ titulo: string, descripcion: string, estado: string, responsable: string, fechaLimite: string }} tarea
 */
export const createTarea = (tarea) => api.post('/', tarea);

// ─── PUT ──────────────────────────────────────────────────────────────────────

/**
 * Actualiza una tarea existente.
 * @param {number} id
 * @param {{ titulo: string, descripcion: string, estado: string, responsable: string, fechaLimite: string }} tarea
 */
export const updateTarea = (id, tarea) => api.put(`/${id}`, tarea);

// ─── DELETE ───────────────────────────────────────────────────────────────────

/** Elimina una tarea por su ID */
export const deleteTarea = (id) => api.delete(`/${id}`);

export default api;
