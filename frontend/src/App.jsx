import React, { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import ListadoTareas from './components/ListadoTareas.jsx';
import CrearTarea from './components/CrearTarea.jsx';
import EditarTarea from './components/EditarTarea.jsx';
import EliminarTarea from './components/EliminarTarea.jsx';
import './index.css';

/**
 * Componente raíz de la aplicación.
 * Diseño minimalista "Split View": Lista a la izquierda, formularios a la derecha.
 */
function App() {
  const [activeSection, setActiveSection] = useState('tareas');
  const [selectedId, setSelectedId] = useState(null);
  // Ref para disparar una recarga en el ListadoTareas desde componentes externos
  const refrescarListado = useRef(null);

  const handleNavigate = (section) => {
    // BUG #9 fix: siempre limpiar selectedId al navegar desde el Header,
    // para que 'Editar Tarea' no auto-cargue la tarea anteriormente seleccionada
    setActiveSection(section);
    setSelectedId(null);
  };

  const handleEditClick = (id) => {
    setSelectedId(id);
    setActiveSection('editar');
  };

  return (
    <div className="app">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="main-content">
        {/* Área Central: Siempre visible el listado y tablero */}
        <section className="center-area" id="tareas-area">
          <ListadoTareas
            onEditTarea={handleEditClick}
            // BUG #10 fix: exponer función de recarga para que EliminarTarea la use
            onRegisterRefresh={(fn) => { refrescarListado.current = fn; }}
          />
        </section>

        {/* Panel Lateral: Cambia dinámicamente el formulario según la navegación */}
        <section className="side-panel">
          {(activeSection === 'tareas' || activeSection === 'crear') && (
            <div className="seccion" id="crear">
              <CrearTarea onTareaCreada={() => setActiveSection('tareas')} />
            </div>
          )}

          {activeSection === 'editar' && (
            <div className="seccion" id="editar">
              <EditarTarea 
                selectedId={selectedId} 
                onTareaEditada={() => {
                  setSelectedId(null);
                  setActiveSection('tareas');
                }} 
              />
            </div>
          )}

          {activeSection === 'eliminar' && (
            <div className="seccion" id="eliminar">
              <EliminarTarea
                // BUG #10 fix: al eliminar desde el panel, refrescar el listado
                onTareaEliminada={() => refrescarListado.current?.()}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
