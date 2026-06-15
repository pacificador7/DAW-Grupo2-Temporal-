import React, { useState } from 'react';
import { ClipboardList, ListTodo, PlusCircle, Edit, Trash2 } from 'lucide-react';
import styles from './Header.module.css';

/**
 * Header con navbar de navegación principal.
 * Recibe `activeSection` para resaltar el enlace activo,
 * y `onNavigate` para cambiar de sección sin recargar la página.
 */
const Header = ({ activeSection, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'tareas',   label: 'Ver Tareas',     icon: <ListTodo size={16} /> },
    { id: 'crear',    label: 'Crear Tarea',    icon: <PlusCircle size={16} /> },
    { id: 'editar',   label: 'Editar Tarea',   icon: <Edit size={16} /> },
    { id: 'eliminar', label: 'Eliminar Tarea', icon: <Trash2 size={16} /> },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>

        {/* Logo / Título */}
        <div className={styles.brand}>
          <ClipboardList size={24} strokeWidth={2.5} aria-hidden="true" />
          <h1 className={styles.brandTitle}>Gestión de Tareas</h1>
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          id="menu-toggle"
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Navbar */}
        <nav className={`${styles.navbar} ${menuOpen ? styles.navOpen : ''}`}>
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              className={`${styles.navLink} ${activeSection === id ? styles.navLinkActive : ''}`}
              onClick={() => handleNav(id)}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default Header;
