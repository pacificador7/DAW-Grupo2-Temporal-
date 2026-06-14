import { useState } from "react";
import axios from "axios";

const estadosValidos = ["PENDIENTE", "EN_PROGRESO", "COMPLETADA"];

export default function CrearTarea({ onTareaCreada }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    estado: "PENDIENTE",
    responsable: "",
    fechaLimite: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      await axios.post("/tareas", form);
      setMensaje({ tipo: "exito", texto: "✅ Tarea creada exitosamente." });
      setForm({
        titulo: "",
        descripcion: "",
        estado: "PENDIENTE",
        responsable: "",
        fechaLimite: "",
      });
      if (onTareaCreada) onTareaCreada();
    } catch (error) {
      const detalle =
        error.response?.data?.message || "No se pudo crear la tarea.";
      setMensaje({ tipo: "error", texto: `❌ Error: ${detalle}` });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <h2>Crear Tarea</h2>

      {mensaje && (
        <p className={`mensaje ${mensaje.tipo}`}>{mensaje.texto}</p>
      )}

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
            placeholder="Ej: Preparar entrega"
          />
        </div>

        <div className="campo">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Detalle de la tarea..."
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
            placeholder="Nombre del responsable"
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
          {cargando ? "Creando..." : "Crear Tarea"}
        </button>
      </form>
    </div>
  );
}