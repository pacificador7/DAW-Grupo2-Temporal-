import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import Header from './components/Header.jsx';
import TareasTable from './components/TareasTable.jsx'; // Añadido por Persona 3
import EditarTarea from './components/EditarTarea.jsx';
import EliminarTarea from './components/EliminarTarea.jsx';
import './index.css';

/**
 * Componente raíz de la aplicación.
 * Controla qué sección está activa y renderiza el Header.
 */
function App() {
  const [activeSection, setActiveSection] = useState('tareas');

  return (
    <div className="app">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="main-content">
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
            <EditarTarea />
          </section>
        )}

        {activeSection === 'eliminar' && (
          <section className="seccion" id="eliminar">
            <EliminarTarea />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;