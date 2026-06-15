import React, { useState } from 'react';
import Header from './components/Header.jsx';
import ListadoTareas from './components/ListadoTareas.jsx';
import CrearTarea from './components/CrearTarea.jsx';
import EditarTarea from './components/EditarTarea.jsx';
import EliminarTarea from './components/EliminarTarea.jsx';
import './index.css';

/**
 * Componente raíz de la aplicación.
 * Controla qué sección está activa, maneja estados compartidos y renderiza el Header.
 */
function App() {
  const [activeSection, setActiveSection] = useState('tareas');
  const [selectedId, setSelectedId] = useState(null);

  // Al navegar desde el Header, si van a 'editar' sin hacer clic en una tarea, limpiamos el ID seleccionado.
  const handleNavigate = (section) => {
    setActiveSection(section);
    if (section !== 'editar') {
      setSelectedId(null);
    }
  };

  const handleEditClick = (id) => {
    setSelectedId(id);
    setActiveSection('editar');
  };

  return (
    <div className="app">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="main-content">
        {activeSection === 'tareas' && (
          <section className="seccion" id="tareas">
            <ListadoTareas onEditTarea={handleEditClick} />
          </section>
        )}

        {activeSection === 'crear' && (
          <section className="seccion" id="crear">
            <CrearTarea onTareaCreada={() => setActiveSection('tareas')} />
          </section>
        )}

        {activeSection === 'editar' && (
          <section className="seccion" id="editar">
            <EditarTarea 
              selectedId={selectedId} 
              onTareaEditada={() => {
                setSelectedId(null);
                setActiveSection('tareas');
              }} 
            />
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
