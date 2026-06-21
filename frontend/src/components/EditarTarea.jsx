import React, { useState, useEffect } from "react";
import { getTareaById, updateTarea } from "../api/tareasApi";
import { 
  Edit, 
  Search, 
  Type, 
  AlignLeft, 
  Activity, 
  User, 
  Calendar, 
  Save, 
  X, 
  CheckCircle, 
  XCircle,
  Loader
} from "lucide-react";

const estadosValidos = ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"];

export default function EditarTarea({ selectedId, onTareaEditada }) {
  const [idBusqueda, setIdBusqueda] = useState("");
  const [form, setForm] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [buscando, setBuscando] = useState(false);

  // Carga automática si el ID viene propiciado por el listado
  useEffect(() => {
    if (selectedId) {
      setIdBusqueda(selectedId.toString());
      cargarTareaDirecto(selectedId);
    } else {
      setForm(null);
      setIdBusqueda("");
      setMensaje(null);
    }
  }, [selectedId]);

  const cargarTareaDirecto = async (id) => {
    if (!id) return;
    setBuscando(true);
    setMensaje(null);
    setForm(null);

    try {
      const res = await getTareaById(id);
      const tarea = res.data;
      setForm({
        titulo: tarea.titulo || "",
        descripcion: tarea.descripcion || "",
        estado: tarea.estado || "PENDIENTE",
        responsable: tarea.responsable || "",
        fechaLimite: tarea.fechaLimite || "",
      });
    } catch (error) {
      const detalle =
        error.response?.status === 404
          ? `No se encontró la tarea con ID ${id}.`
          : error.response?.data?.message || "Error al cargar la tarea.";
      setMensaje({ tipo: "error", texto: detalle });
    } finally {
      setBuscando(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    cargarTareaDirecto(idBusqueda);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    const targetId = selectedId || idBusqueda;

    try {
      await updateTarea(targetId, form);
      setMensaje({ tipo: "exito", texto: "Tarea actualizada correctamente." });
      
      // Esperar un momento antes de volver al listado
      setTimeout(() => {
        if (onTareaEditada) onTareaEditada();
      }, 1500);
    } catch (error) {
      const detalle =
        error.response?.data?.message || "No se pudo actualizar la tarea.";
      setMensaje({ tipo: "error", texto: `Error: ${detalle}` });
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    if (onTareaEditada) {
      onTareaEditada();
    } else {
      setForm(null);
      setIdBusqueda("");
      setMensaje(null);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        <Edit size={24} style={{ color: "var(--color-primary)" }} />
        <span>Editar Tarea</span>
      </h2>

      {/* Buscador de ID manual, solo si no viene de una selección directa */}
      {!selectedId && (
        <form onSubmit={handleManualSearch} className="busqueda">
          <label htmlFor="idBusqueda" style={{ fontWeight: '700', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Buscar Tarea por ID
          </label>
          <div className="busqueda-fila">
            <input
              id="idBusqueda"
              type="number"
              min="1"
              value={idBusqueda}
              onChange={(e) => setIdBusqueda(e.target.value)}
              placeholder="Ej: 3"
              required
              style={{ margin: 0 }}
            />
            <button 
              type="submit" 
              className="btn-buscar" 
              disabled={buscando || !idBusqueda}
            >
              {buscando ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Cargar Tarea</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Cargando por ID directo */}
      {selectedId && buscando && (
        <div className="placeholder-msg">
          <Loader size={20} className="animate-spin" />
          <span>Cargando datos de la tarea #{selectedId}...</span>
        </div>
      )}

      {mensaje && (
        <div className={mensaje.tipo === "exito" ? "msg-exito" : "msg-error"}>
          {mensaje.tipo === "exito" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{mensaje.texto}</span>
        </div>
      )}

      {form && (
        <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          
          {/* Título */}
          <div className="form-group">
            <label htmlFor="edit-titulo">
              <Type size={16} />
              <span>Título de la tarea <span className="obligatorio">*</span></span>
            </label>
            <input
              id="edit-titulo"
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              maxLength={150}
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="edit-descripcion">
              <AlignLeft size={16} />
              <span>Descripción</span>
            </label>
            <textarea
              id="edit-descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Fila: Estado y Responsable */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-estado">
                <Activity size={16} />
                <span>Estado <span className="obligatorio">*</span></span>
              </label>
              <select 
                id="edit-estado"
                name="estado" 
                value={form.estado} 
                onChange={handleChange} 
                required
              >
                {estadosValidos.map((e) => (
                  <option key={e} value={e}>
                    {e.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-responsable">
                <User size={16} />
                <span>Responsable</span>
              </label>
              <input
                id="edit-responsable"
                type="text"
                name="responsable"
                value={form.responsable}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
          </div>

          {/* Fecha Límite */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-fechaLimite">
                <Calendar size={16} />
                <span>Fecha Límite</span>
              </label>
              <input
                id="edit-fechaLimite"
                type="date"
                name="fechaLimite"
                value={form.fechaLimite}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ display: 'none' }}></div>
          </div>

          {/* Botones de acción */}
          <div className="form-botones">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleCancelar}
              disabled={cargando}
            >
              <X size={16} />
              <span>Cancelar</span>
            </button>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={cargando || !form.titulo}
            >
              {cargando ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}