import { useState } from "react";
import axios from "axios";

const estadosValidos = ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"];

export default function EditarTarea({ onTareaEditada }) {
  const [idBusqueda, setIdBusqueda] = useState("");
  const [form, setForm] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [buscando, setBuscando] = useState(false);

  const cargarTarea = async () => {
    if (!idBusqueda) return;
    setBuscando(true);
    setMensaje(null);
    setForm(null);

    try {
      const res = await axios.get(`/tareas/${idBusqueda}`);
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
          ? `No se encontró la tarea con ID ${idBusqueda}.`
          : error.response?.data?.message || "Error al cargar la tarea.";
      setMensaje({ tipo: "error", texto: `❌ ${detalle}` });
    } finally {
      setBuscando(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      await axios.put(`/tareas/${idBusqueda}`, form);
      setMensaje({ tipo: "exito", texto: "✅ Tarea actualizada correctamente." });
      if (onTareaEditada) onTareaEditada();
    } catch (error) {
      const detalle =
        error.response?.data?.message || "No se pudo actualizar la tarea.";
      setMensaje({ tipo: "error", texto: `❌ Error: ${detalle}` });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <h2>Editar Tarea</h2>

      <div className="busqueda">
        <label>ID de la tarea</label>
        <div className="busqueda-fila">
          <input
            type="number"
            min="1"
            value={idBusqueda}
            onChange={(e) => setIdBusqueda(e.target.value)}
            placeholder="Ej: 3"
          />
          <button type="button" onClick={cargarTarea} disabled={buscando || !idBusqueda}>
            {buscando ? "Buscando..." : "Cargar"}
          </button>
        </div>
      </div>

      {mensaje && (
        <p className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</p>
      )}

      {form && (
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Título *</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              maxLength={150}
            />
          </div>

          <div className="campo">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="campo">
            <label>Estado *</label>
            <select name="estado" value={form.estado} onChange={handleChange} required>
              {estadosValidos.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Responsable</label>
            <input
              type="text"
              name="responsable"
              value={form.responsable}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          <div className="campo">
            <label>Fecha Límite</label>
            <input
              type="date"
              name="fechaLimite"
              value={form.fechaLimite}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      )}
    </div>
  );
}