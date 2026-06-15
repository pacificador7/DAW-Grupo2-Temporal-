import React, { useState, useEffect } from 'react';
import { getTareas } from '../api/tareasApi';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';

const ListadoTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      // Consumimos GET / mediante la función exportada en tareasApi.js
      const response = await getTareas();
      setTareas(response.data);
    } catch (err) {
      console.error("Error al obtener las tareas:", err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  if (loading) {
    return (
      <div className="placeholder-msg">
        <Loader size={20} className="animate-spin" aria-hidden="true" />
        Cargando listado de tareas
      </div>
    );
  }

  if (error) {
    return (
      <div className="placeholder-msg" style={{ color: '#dc3545', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <button 
          onClick={cargarTareas} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            padding: '6px 12px', 
            cursor: 'pointer',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24'
          }}
        >
          <RefreshCw size={14} /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="tabla-contenedor" style={{ marginTop: '15px', overflowX: 'auto' }}>
      {tareas.length === 0 ? (
        <p className="placeholder-msg">No hay tareas disponibles en este momento.</p>
      ) : (
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eaeaea' }}>
              <th style={{ padding: '12px 8px' }}>ID</th>
              <th style={{ padding: '12px 8px' }}>Título</th>
              <th style={{ padding: '12px 8px' }}>Descripción</th>
              <th style={{ padding: '12px 8px' }}>Responsable</th>
              <th style={{ padding: '12px 8px' }}>Fecha Límite</th>
              <th style={{ padding: '12px 8px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map((tarea) => (
              <tr key={tarea.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{tarea.id}</td>
                <td style={{ padding: '12px 8px' }}>{tarea.titulo}</td>
                <td style={{ padding: '12px 8px' }}>{tarea.descripcion || <em style={{ color: '#999' }}>Sin descripción</em>}</td>
                <td style={{ padding: '12px 8px' }}>{tarea.responsable || <em style={{ color: '#999' }}>No asignado</em>}</td>
                <td style={{ padding: '12px 8px' }}>{tarea.fechaLimite || <em style={{ color: '#999' }}>-</em>}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span 
                    className={`badge badge-${tarea.estado?.toLowerCase()}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85em',
                      backgroundColor: tarea.estado === 'COMPLETADA' ? '#d4edda' : '#fff3cd',
                      color: tarea.estado === 'COMPLETADA' ? '#155724' : '#856404'
                    }}
                  >
                    {tarea.estado || 'PENDIENTE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoTareas;
