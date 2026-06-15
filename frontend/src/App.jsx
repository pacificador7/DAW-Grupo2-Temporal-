import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import Header from './components/Header.jsx';
import TareasTable from './components/TareasTable.jsx'; // Añadido por Persona 3
import './index.css';

/**
 * Componente raíz de la aplicación.
 * Controla qué sección está activa y renderiza el Header.
 * Las personas 3, 4 y 5 añadirán sus componentes aquí.
 */
function App() {
  const [activeSection, setActiveSection] = useState('tareas');

  return (
    <div className="app">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="main-content">
        {/*
          TODO (Persona 3): Reemplazar placeholder con <TareasTable /> cuando esté listo
          TODO (Persona 4): Reemplazar placeholder con <FormCrear /> cuando esté listo
          TODO (Persona 5): Reemplazar placeholders con <FormEditar /> y <FormEliminar /> cuando estén listos
        */}

        {activeSection === 'tareas' && (
          <section className="seccion" id="tareas">
            <h2>Listado de Tareas</h2>
            {/* Persona 3: Inyección del componente dinámico conectado a la API */}
            <TareasTable />
          </section>
        )}

        {activeSection === 'crear' && (
          <section className="seccion" id="crear">
            <h2>Crear Tarea</h2>
            <p className="placeholder-msg">
              <Loader size={16} strokeWidth={2} aria-hidden="true" />
              Componente de formulario pendiente — Persona 4
            </p>
          </section>
        )}

        {activeSection === 'editar' && (
          <section className="seccion" id="editar">
            <h2>Editar Tarea</h2>
            <p className="placeholder-msg">
              <Loader size={16} strokeWidth={2} aria-hidden="true" />
              Componente de edición pendiente — Persona 5
            </p>
          </section>
        )}

        {activeSection === 'eliminar' && (
          <section className="seccion" id="eliminar">
            <h2>Eliminar Tarea</h2>
            <p className="placeholder-msg">
              <Loader size={16} strokeWidth={2} aria-hidden="true" />
              Componente de eliminación pendiente — Persona 5
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;