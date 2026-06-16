import React, { useState } from 'react';
import { getTareaById, deleteTarea } from '../api/tareasApi';
import { 
  Trash2, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Info 
} from 'lucide-react';

export default function EliminarTarea() {
  const [buscarId, setBuscarId]     = useState('');
  const [tarea, setTarea]           = useState(null);
  const [modalVisible, setModal]    = useState(false);
  const [cargando, setCargando]     = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError]           = useState('');
  const [exito, setExito]           = useState('');

  // Buscar tarea para confirmar antes de eliminar
  async function handleBuscar(e) {
    e.preventDefault();
    if (!buscarId) return;

    setError('');
    setExito('');
    setTarea(null);
    setCargando(true);

    try {
      const { data } = await getTareaById(buscarId);
      setTarea(data);
      setModal(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`No se encontró ninguna tarea con ID ${buscarId}.`);
      } else {
        setError('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
      }
    } finally {
      setCargando(false);
    }
  }

  // Confirmar eliminación
  async function handleEliminar() {
    setEliminando(true);
    setError('');

    try {
      await deleteTarea(tarea.id);
      setExito(`Tarea #${tarea.id} "${tarea.titulo}" eliminada correctamente.`);
      setModal(false);
      setTarea(null);
      setBuscarId('');
    } catch {
      setError('No se pudo eliminar la tarea. Intenta de nuevo.');
      setModal(false);
    } finally {
      setEliminando(false);
    }
  }

  // Cancelar
  function handleCancelar() {
    setModal(false);
    setTarea(null);
    setBuscarId('');
    setError('');
  }

  return (
    <div className="form-container">
      <h2 className="form-title">
        <Trash2 size={24} style={{ color: 'var(--color-danger)' }} />
        <span>Eliminar Tarea</span>
      </h2>

      {/* Buscador por ID */}
      <form onSubmit={handleBuscar} className="buscar-form" style={{ marginTop: '24px' }}>
        <label htmlFor="eliminar-id" className="form-label" style={{ fontWeight: '700', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          ID de la tarea a eliminar <span className="obligatorio">*</span>
        </label>
        <div className="buscar-row">
          <input
            id="eliminar-id"
            type="number"
            min="1"
            placeholder="Ej: 1"
            value={buscarId}
            onChange={(e) => setBuscarId(e.target.value)}
            className="input-id"
            required
            style={{ margin: 0 }}
          />
          <button 
            type="submit" 
            className="btn-danger" 
            disabled={cargando || !buscarId}
          >
            {cargando ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span>Buscar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Mensajes de error o éxito */}
      {error && (
        <div className="msg-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      {exito && (
        <div className="msg-exito">
          <CheckCircle size={18} />
          <span>{exito}</span>
        </div>
      )}

      {/* Modal de confirmación */}
      {modalVisible && tarea && (
        <>
          <div className="modal-overlay" onClick={handleCancelar} />
          <div className="modal-box">
            <div className="modal-icon-container">
              <AlertTriangle size={24} />
            </div>
            <h4 className="modal-titulo">¿Eliminar esta tarea?</h4>
            
            <div className="modal-info">
              ID: #{tarea.id} — "{tarea.titulo}"
            </div>
            
            <p className="modal-advertencia">
              Esta acción eliminará permanentemente la tarea del sistema. Esta acción no se puede deshacer.
            </p>
            
            <div className="form-botones">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelar}
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
                {eliminando ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Sí, eliminar</span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}