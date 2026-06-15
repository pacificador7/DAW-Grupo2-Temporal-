import { useState } from 'react';
import { getTareaById, deleteTarea } from '../api/tareasApi';

export default function EliminarTarea() {
  const [buscarId, setBuscarId]     = useState('');
  const [tarea, setTarea]           = useState(null);
  const [modalVisible, setModal]    = useState(false);
  const [cargando, setCargando]     = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError]           = useState('');
  const [exito, setExito]           = useState('');

  //buscar tarea para confirmar antes de eliminar "aqui se busca:"(GET /tareas/{id})
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
        setError(`No se encontro ninguna tarea con ID ${buscarId}.`);
      } else {
        setError('Error al conectar con el servidor. Verifica que el backend este corriendo.');
      }
    } finally {
      setCargando(false);
    }
  }

  // confirmar eliminacion (DELETE /tareas/{id})
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

  //cancelar
  function handleCancelar() {
    setModal(false);
    setTarea(null);
    setBuscarId('');
    setError('');
  }

  return (
    <div className="form-card">
      <h2 className="form-title">Eliminar tarea</h2>


      {/*dentro de react se ocupa {} para comentar, con // no funciona*/}
      {/*buscador con ID*/}
      <form onSubmit={handleBuscar} className="buscar-form">
        <label htmlFor="eliminar-id" className="form-label">
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
          />
          <button type="submit" className="btn-eliminar" disabled={cargando}>
            {cargando ? 'Buscando...' : 'Eliminar'}
          </button>
        </div>
      </form>

      {/*Mensajes*/}
      {error && <p className="msg-error">{error}</p>}
      {exito && <p className="msg-exito">✓ {exito}</p>}

      {/*Modal de confirmacion*/}
      {modalVisible && tarea && (
        <>
          <div className="modal-overlay" onClick={handleCancelar} />
          <div className="modal-box">
            <h4 className="modal-titulo">¿Eliminar esta tarea?</h4>
            <p className="modal-info">
              ID: {tarea.id} — "{tarea.titulo}"
            </p>
            <p className="modal-advertencia">
              Esta acción no se puede deshacer.
            </p>
            <div className="form-botones">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-eliminar-confirmar"
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
}