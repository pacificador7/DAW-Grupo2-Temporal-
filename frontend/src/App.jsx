import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import Header from './components/Header.jsx';
import TareasTable from './components/TareasTable.jsx';
import EditarTarea from './components/EditarTarea.jsx';
import EliminarTarea from './components/EliminarTarea.jsx';
import './index.css';
import CrearTarea from './components/CrearTarea.jsx';

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
    <CrearTarea />
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
