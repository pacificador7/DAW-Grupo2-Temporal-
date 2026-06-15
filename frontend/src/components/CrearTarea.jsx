import React, { useState } from "react";
import axios from "axios";
import { 
  Type, 
  AlignLeft, 
  Activity, 
  User, 
  Calendar, 
  PlusCircle, 
  CheckCircle, 
  XCircle,
  Loader
} from "lucide-react";

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

  const handleReset = () => {
    setForm({
      titulo: "",
      descripcion: "",
      estado: "PENDIENTE",
      responsable: "",
      fechaLimite: "",
    });
    setMensaje(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      await axios.post("/tareas", form);
      setMensaje({ tipo: "exito", texto: "Tarea creada exitosamente." });
      setForm({
        titulo: "",
        descripcion: "",
        estado: "PENDIENTE",
        responsable: "",
        fechaLimite: "",
      });
      // Esperar un momento antes de redirigir para que lean el mensaje de éxito
      setTimeout(() => {
        if (onTareaCreada) onTareaCreada();
      }, 1500);
    } catch (error) {
      const detalle =
        error.response?.data?.message || "No se pudo conectar con el servidor.";
      setMensaje({ tipo: "error", texto: `Error: ${detalle}` });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card">
      <h2>
        <PlusCircle size={24} style={{ color: "var(--color-primary)" }} />
        <span>Crear Tarea</span>
      </h2>

      {mensaje && (
        <div className={mensaje.tipo === "exito" ? "msg-exito" : "msg-error"}>
          {mensaje.tipo === "exito" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{mensaje.texto}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
        
        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">
            <Type size={16} />
            <span>Título de la tarea <span className="obligatorio">*</span></span>
          </label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
            maxLength={150}
            placeholder="Ej: Redactar documentación técnica..."
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion">
            <AlignLeft size={16} />
            <span>Descripción</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Describe brevemente los entregables y alcance..."
          />
        </div>

        {/* Fila: Estado y Responsable */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="estado">
              <Activity size={16} />
              <span>Estado <span className="obligatorio">*</span></span>
            </label>
            <select 
              id="estado"
              name="estado" 
              value={form.estado} 
              onChange={handleChange} 
              required
            >
              {estadosValidos.map((e) => (
                <option key={e} value={e}>
                  {e.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="responsable">
              <User size={16} />
              <span>Responsable</span>
            </label>
            <input
              id="responsable"
              type="text"
              name="responsable"
              value={form.responsable}
              onChange={handleChange}
              maxLength={100}
              placeholder="Nombre del encargado..."
            />
          </div>
        </div>

        {/* Fecha Límite */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaLimite">
              <Calendar size={16} />
              <span>Fecha Límite</span>
            </label>
            <input
              id="fechaLimite"
              type="date"
              name="fechaLimite"
              value={form.fechaLimite}
              onChange={handleChange}
            />
          </div>
          {/* Espacio vacío en desktop para balancear la cuadrícula */}
          <div className="form-group" style={{ display: 'none' }}></div>
        </div>

        {/* Botones de acción */}
        <div className="form-botones">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleReset}
            disabled={cargando}
          >
            Limpiar Campos
          </button>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={cargando || !form.titulo}
          >
            {cargando ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Crear Tarea</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}