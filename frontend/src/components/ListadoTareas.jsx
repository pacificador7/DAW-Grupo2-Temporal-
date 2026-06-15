import React, { useState, useEffect } from 'react';
import { getTareas, deleteTarea, updateTarea } from '../api/tareasApi';
import { 
  Loader, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar, 
  ListTodo,
  LayoutGrid
} from 'lucide-react';

const ListadoTareas = ({ onEditTarea }) => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modo de Vista ('lista' o 'tablero')
  const [viewMode, setViewMode] = useState('lista');

  // Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Modal de Eliminación
  const [tareaAEliminar, setTareaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTareas();
      setTareas(response.data);
    } catch (err) {
      console.error("Error al obtener las tareas:", err);
      setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const abrirModalEliminar = (tarea) => {
    setTareaAEliminar(tarea);
  };

  const cerrarModalEliminar = () => {
    setTareaAEliminar(null);
  };

  const handleEliminar = async () => {
    if (!tareaAEliminar) return;
    setEliminando(true);
    try {
      await deleteTarea(tareaAEliminar.id);
      setTareas(tareas.filter(t => t.id !== tareaAEliminar.id));
      setTareaAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
      alert("No se pudo eliminar la tarea. Intente de nuevo.");
    } finally {
      setEliminando(false);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const tareaOriginal = tareas.find(t => t.id === id);
    if (!tareaOriginal) return;

    // Actualización local rápida
    setTareas(tareas.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));

    try {
      await updateTarea(id, {
        titulo: tareaOriginal.titulo,
        descripcion: tareaOriginal.descripcion,
        estado: nuevoEstado,
        responsable: tareaOriginal.responsable,
        fechaLimite: tareaOriginal.fechaLimite
      });
    } catch (err) {
      console.error("Error al actualizar el estado de la tarea:", err);
      alert("No se pudo guardar el cambio en el servidor.");
    } finally {
      // Recargar tareas para asegurar que todo cuadre
      const response = await getTareas();
      setTareas(response.data);
    }
  };

  if (loading) {
    return (
      <div className="placeholder-msg">
        <Loader size={20} className="animate-spin" aria-hidden="true" />
        <span>Cargando listado de tareas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="placeholder-msg" style={{ color: 'var(--color-danger)', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: '600' }}>{error}</span>
        </div>
        <button 
          onClick={cargarTareas} 
          className="btn-buscar"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Reintentar
        </button>
      </div>
    );
  }

  // --- Estadísticas ---
  const total = tareas.length;
  const pendientes = tareas.filter(t => t.estado === 'PENDIENTE').length;
  const enProgreso = tareas.filter(t => t.estado === 'EN_PROGRESO').length;
  const completadas = tareas.filter(t => t.estado === 'COMPLETADA').length;
  const porcentajeProgreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

  // --- Filtrado Inteligente de Tareas (para Vista Lista) ---
  const tareasFiltradasLista = tareas.filter(tarea => {
    const cumpleBusqueda = 
      tarea.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.responsable?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let cumpleEstado = false;
    if (statusFilter === 'TODOS') {
      cumpleEstado = tarea.estado !== 'COMPLETADA';
    } else {
      cumpleEstado = tarea.estado === statusFilter;
    }

    return cumpleBusqueda && cumpleEstado;
  });

  // --- Filtrado para Vista Tablero (busca por texto, divide en columnas) ---
  const tareasFiltradasTablero = tareas.filter(tarea => 
    tarea.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tarea.responsable?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colPendientes = tareasFiltradasTablero.filter(t => t.estado === 'PENDIENTE');
  const colEnProgreso = tareasFiltradasTablero.filter(t => t.estado === 'EN_PROGRESO');
  const colCompletadas = tareasFiltradasTablero.filter(t => t.estado === 'COMPLETADA');

  return (
    <div>
      {/* Cabecera del Listado con Selector de Vistas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ margin: 0, border: 'none' }}>Gestión de Tareas</h2>
        
        <div className="view-toggle-group">
          <button 
            className={`view-toggle-btn ${viewMode === 'lista' ? 'active' : ''}`}
            onClick={() => setViewMode('lista')}
          >
            <ListTodo size={12} />
            <span>Lista</span>
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'tablero' ? 'active' : ''}`}
            onClick={() => setViewMode('tablero')}
          >
            <LayoutGrid size={12} />
            <span>Tablero</span>
          </button>
        </div>
      </div>

      {/* Cintillo de Resumen Simplificado (Aesthetic Estudiante) */}
      <div className="stats-summary-bar">
        <div 
          className={`stats-summary-item ${statusFilter === 'TODOS' && viewMode === 'lista' ? 'active' : ''}`}
          onClick={() => { setViewMode('lista'); setStatusFilter('TODOS'); }}
          title="Ver tareas activas en lista"
        >
          <span>Tareas Activas</span>
          <span className="stats-summary-count">{pendientes + enProgreso}</span>
        </div>

        <div 
          className={`stats-summary-item ${statusFilter === 'PENDIENTE' && viewMode === 'lista' ? 'active' : ''}`}
          onClick={() => { setViewMode('lista'); setStatusFilter('PENDIENTE'); }}
          title="Filtrar por Pendientes"
        >
          <span>Pendientes</span>
          <span className="stats-summary-count">{pendientes}</span>
        </div>

        <div 
          className={`stats-summary-item ${statusFilter === 'EN_PROGRESO' && viewMode === 'lista' ? 'active' : ''}`}
          onClick={() => { setViewMode('lista'); setStatusFilter('EN_PROGRESO'); }}
          title="Filtrar por En Curso"
        >
          <span>En Curso</span>
          <span className="stats-summary-count">{enProgreso}</span>
        </div>

        <div 
          className={`stats-summary-item ${statusFilter === 'COMPLETADA' && viewMode === 'lista' ? 'active' : ''}`}
          onClick={() => { setViewMode('lista'); setStatusFilter('COMPLETADA'); }}
          title="Filtrar por Completadas"
        >
          <span>Completadas</span>
          <span className="stats-summary-count">{completadas}</span>
        </div>

        <div className="stats-summary-item" style={{ cursor: 'default' }}>
          <span>Progreso General: {porcentajeProgreso}%</span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="search-filter-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por título o responsable..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {viewMode === 'lista' && (
          <div className="filter-wrapper">
            <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              <Filter size={14} /> Filtrar:
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
              style={{ width: 'auto', margin: 0 }}
            >
              <option value="TODOS">Tareas Activas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="COMPLETADA">Completadas</option>
            </select>
          </div>
        )}
      </div>

      {/* RENDERIZADO DE VISTAS */}
      {viewMode === 'lista' ? (
        /* VISTA LISTA (TABLA CLÁSICA) */
        tareasFiltradasLista.length === 0 ? (
          <div className="placeholder-msg">
            <AlertCircle size={18} />
            <span>No hay tareas que mostrar en esta lista o filtro.</span>
          </div>
        ) : (
          <div className="tabla-contenedor">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Responsable</th>
                  <th>Fecha Límite</th>
                  <th style={{ width: '130px' }}>Estado</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareasFiltradasLista.map((tarea) => (
                  <tr key={tarea.id}>
                    <td style={{ fontWeight: '700', color: 'var(--color-text-muted)' }}>#{tarea.id}</td>
                    <td style={{ fontWeight: '700', color: 'var(--color-text)' }}>{tarea.titulo}</td>
                    <td style={{ color: 'var(--color-text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tarea.descripcion || <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>Sin descripción</span>}
                    </td>
                    <td style={{ fontWeight: '500' }}>
                      {tarea.responsable || <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>No asignado</span>}
                    </td>
                    <td>
                      {tarea.fechaLimite ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} style={{ color: 'var(--color-text-light)' }} /> {tarea.fechaLimite}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-light)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <select
                        value={tarea.estado || 'PENDIENTE'}
                        onChange={(e) => handleCambiarEstado(tarea.id, e.target.value)}
                        className={`badge-select badge-${(tarea.estado || 'PENDIENTE').toLowerCase()}`}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="COMPLETADA">Completada</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button 
                          className="action-btn" 
                          onClick={() => onEditTarea(tarea.id)}
                          title="Editar"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          className="action-btn" 
                          onClick={() => abrirModalEliminar(tarea)}
                          title="Eliminar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* VISTA TABLERO KANBAN (SIN DRAG & DROP - CAMBIO MEDIANTE SELECT) */
        <div className="kanban-board">
          {/* Columna: PENDIENTES */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-column-title">Pendientes</span>
              <span className="kanban-column-count">{colPendientes.length}</span>
            </div>
            <div className="kanban-cards-container">
              {colPendientes.map(tarea => (
                <div key={tarea.id} className="kanban-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="kanban-card-id">#{tarea.id}</span>
                    
                    {/* Botones de acción directos */}
                    <div className="kanban-card-actions">
                      <button 
                        className="kanban-card-action-btn"
                        onClick={() => onEditTarea(tarea.id)}
                        title="Editar"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        className="kanban-card-action-btn"
                        onClick={() => abrirModalEliminar(tarea)}
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="kanban-card-title">{tarea.titulo}</div>
                  
                  {/* Selector interactivo de estado que mueve la tarjeta */}
                  <select
                    value={tarea.estado || 'PENDIENTE'}
                    onChange={(e) => handleCambiarEstado(tarea.id, e.target.value)}
                    className={`badge-select badge-${(tarea.estado || 'PENDIENTE').toLowerCase()}`}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="COMPLETADA">Completada</option>
                  </select>

                  <div className="kanban-card-footer">
                    <div className="kanban-card-meta">
                      {tarea.fechaLimite ? (
                        <>
                          <Calendar size={12} />
                          <span>{tarea.fechaLimite}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--color-text-light)' }}>Sin fecha</span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                      {tarea.responsable ? `Resp: ${tarea.responsable}` : 'Sin asignar'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna: EN PROGRESO */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-column-title">En Curso</span>
              <span className="kanban-column-count">{colEnProgreso.length}</span>
            </div>
            <div className="kanban-cards-container">
              {colEnProgreso.map(tarea => (
                <div key={tarea.id} className="kanban-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="kanban-card-id">#{tarea.id}</span>
                    
                    <div className="kanban-card-actions">
                      <button 
                        className="kanban-card-action-btn"
                        onClick={() => onEditTarea(tarea.id)}
                        title="Editar"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        className="kanban-card-action-btn"
                        onClick={() => abrirModalEliminar(tarea)}
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="kanban-card-title">{tarea.titulo}</div>
                  
                  <select
                    value={tarea.estado || 'PENDIENTE'}
                    onChange={(e) => handleCambiarEstado(tarea.id, e.target.value)}
                    className={`badge-select badge-${(tarea.estado || 'PENDIENTE').toLowerCase()}`}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="COMPLETADA">Completada</option>
                  </select>

                  <div className="kanban-card-footer">
                    <div className="kanban-card-meta">
                      {tarea.fechaLimite ? (
                        <>
                          <Calendar size={12} />
                          <span>{tarea.fechaLimite}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--color-text-light)' }}>Sin fecha</span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                      {tarea.responsable ? `Resp: ${tarea.responsable}` : 'Sin asignar'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna: COMPLETADAS */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <span className="kanban-column-title">Completadas</span>
              <span className="kanban-column-count">{colCompletadas.length}</span>
            </div>
            <div className="kanban-cards-container">
              {colCompletadas.map(tarea => (
                <div key={tarea.id} className="kanban-card" style={{ opacity: 0.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="kanban-card-id" style={{ textDecoration: 'line-through' }}>#{tarea.id}</span>
                    
                    <div className="kanban-card-actions">
                      <button 
                        className="kanban-card-action-btn"
                        onClick={() => onEditTarea(tarea.id)}
                        title="Editar"
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        className="kanban-card-action-btn"
                        onClick={() => abrirModalEliminar(tarea)}
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="kanban-card-title" style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>{tarea.titulo}</div>
                  
                  <select
                    value={tarea.estado || 'PENDIENTE'}
                    onChange={(e) => handleCambiarEstado(tarea.id, e.target.value)}
                    className={`badge-select badge-${(tarea.estado || 'PENDIENTE').toLowerCase()}`}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PROGRESO">En Progreso</option>
                    <option value="COMPLETADA">Completada</option>
                  </select>

                  <div className="kanban-card-footer">
                    <div className="kanban-card-meta">
                      {tarea.fechaLimite ? (
                        <>
                          <Calendar size={12} />
                          <span>{tarea.fechaLimite}</span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--color-text-light)' }}>Sin fecha</span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                      {tarea.responsable ? `Resp: ${tarea.responsable}` : 'Sin asignar'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {tareaAEliminar && (
        <>
          <div className="modal-overlay" onClick={cerrarModalEliminar} />
          <div className="modal-box">
            <div className="modal-icon-container">
              <AlertTriangle size={20} />
            </div>
            <h4 className="modal-titulo">¿Eliminar esta tarea?</h4>
            <div className="modal-info">
              ID: #{tareaAEliminar.id} — "{tareaAEliminar.titulo}"
            </div>
            <p className="modal-advertencia">
              Esta acción eliminará permanentemente la tarea del sistema. Esta acción no se puede deshacer.
            </p>
            <div className="form-botones">
              <button
                type="button"
                className="btn-secondary"
                onClick={cerrarModalEliminar}
                disabled={eliminando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleEliminar}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListadoTareas;
