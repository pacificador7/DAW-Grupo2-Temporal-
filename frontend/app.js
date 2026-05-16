console.log("Frontend funcionando correctamente");

// Mock data para tareas
const mockTareas = [
    {
        id: 1,
        nombre: "Desarrollar API REST",
        descripcion: "Crear endpoints para gestión de tareas",
        estado: "En progreso",
        fecha: "01-06-2026"
    },
    {
        id: 2,
        nombre: "Diseñar interfaz de usuario",
        descripcion: "Crear mockups para la aplicación web",
        estado: "Completada",
        fecha: "15-04-2026"
    },
    {
        id: 3,
        nombre: "Implementar autenticación",
        descripcion: "Agregar login y registro de usuarios",
        estado: "Pendiente",
        fecha: "10-10-2026"
    },
    {
        id: 4,
        nombre: "Pruebas unitarias",
        descripcion: "Escribir y ejecutar pruebas para el backend",
        estado: "En progreso",
        fecha: "05-06-2026"
    },
    {
        id: 5,
        nombre: "Despliegue en producción",
        descripcion: "Configurar servidor y desplegar aplicación",
        estado: "Pendiente",
        fecha: "20-08-2026"
    }
];

// Función para poblar la tabla con tareas
function cargarTareas(tareas = mockTareas) {
    const tbody = document.getElementById('tareas-body');
    if (!tbody) return; // Si no existe la tabla, no hacer nada
    tbody.innerHTML = ''; // Limpiar contenido anterior

    tareas.forEach(tarea => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tarea.id}</td>
            <td>${tarea.nombre}</td>
            <td>${tarea.descripcion}</td>
            <td>${tarea.estado}</td>
            <td>${tarea.fecha}</td>
        `;
        tbody.appendChild(row);
    });
}

// Función para filtrar tareas
function filtrarTareas() {
    const buscarNombre = document.getElementById('buscar-nombre')?.value.toLowerCase() || '';
    const filtrarEstado = document.getElementById('filtrar-estado')?.value || '';
    let filtrarFecha = document.getElementById('filtrar-fecha')?.value || '';

    if (filtrarFecha) {
        const [year, month, day] = filtrarFecha.split('-');
        filtrarFecha = `${day}-${month}-${year}`;
    }

    const tareasFiltradas = mockTareas.filter(tarea => {
        const coincideNombre = tarea.nombre.toLowerCase().includes(buscarNombre);
        const coincideEstado = !filtrarEstado || tarea.estado === filtrarEstado;
        const coincideFecha = !filtrarFecha || tarea.fecha === filtrarFecha;
        return coincideNombre && coincideEstado && coincideFecha;
    });

    cargarTareas(tareasFiltradas);
}

// Función para limpiar filtros
function limpiarFiltros() {
    const buscarNombreInput = document.getElementById('buscar-nombre');
    const filtrarEstadoSelect = document.getElementById('filtrar-estado');
    const filtrarFechaInput = document.getElementById('filtrar-fecha');

    if (buscarNombreInput) buscarNombreInput.value = '';
    if (filtrarEstadoSelect) filtrarEstadoSelect.value = '';
    if (filtrarFechaInput) filtrarFechaInput.value = '';

    cargarTareas(); // Recargar todas las tareas
}

// Cargar tareas cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTareas();

    // Agregar event listeners para filtros si existen
    const buscarNombreInput = document.getElementById('buscar-nombre');
    const filtrarEstadoSelect = document.getElementById('filtrar-estado');
    const filtrarFechaInput = document.getElementById('filtrar-fecha');
    const limpiarFiltrosBtn = document.getElementById('limpiar-filtros');

    if (buscarNombreInput) {
        buscarNombreInput.addEventListener('input', filtrarTareas);
    }
    if (filtrarEstadoSelect) {
        filtrarEstadoSelect.addEventListener('change', filtrarTareas);
    }
    if (filtrarFechaInput) {
        filtrarFechaInput.addEventListener('change', filtrarTareas);
    }
    if (limpiarFiltrosBtn) {
        limpiarFiltrosBtn.addEventListener('click', limpiarFiltros);
    }
});


//POST

function limpiarFormCrear() {
    const form = document.getElementById('form-crear');
    if (!form) return;
    form.reset();
    // Quitar errores visuales
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    document.getElementById('msg-crear').style.display = 'none';
}

function validarCampo(id, errId) {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el || !err) return true;
    if (!el.value.trim()) {
        el.classList.add('input-error');
        err.style.display = 'block';
        return false;
    }
    el.classList.remove('input-error');
    err.style.display = 'none';
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const formCrear = document.getElementById('form-crear');
    if (!formCrear) return;

    formCrear.addEventListener('submit', function (e) {
        e.preventDefault();

        const camposValidos = [
            validarCampo('crear-nombre',      'err-crear-nombre'),
            validarCampo('crear-descripcion', 'err-crear-descripcion'),
            validarCampo('crear-estado',      'err-crear-estado'),
            validarCampo('crear-fecha',       'err-crear-fecha'),
        ].every(Boolean);

        if (!camposValidos) return;

        // Convertir fecha de YYYY-MM-DD a DD-MM-YYYY (igual que el mock data)
        const fechaRaw = document.getElementById('crear-fecha').value;
        const [y, m, d] = fechaRaw.split('-');
        const fechaFormateada = `${d}-${m}-${y}`;

        // Crear objeto tarea nuevo
        const nuevaTarea = {
            id: mockTareas.length + 1,
            nombre:      document.getElementById('crear-nombre').value.trim(),
            descripcion: document.getElementById('crear-descripcion').value.trim(),
            estado:      document.getElementById('crear-estado').value,
            fecha:       fechaFormateada,
        };

        // Agregar al array y refrescar tabla
        mockTareas.push(nuevaTarea);
        cargarTareas();

        // Mostrar mensaje de éxito y limpiar
        limpiarFormCrear();
        const msg = document.getElementById('msg-crear');
        if (msg) {
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        }
    });
});


// PUT

let tareaEditandoId = null;

function buscarTareaParaEditar() {
    const idInput = document.getElementById('editar-id');
    const id = parseInt(idInput?.value);
    const errId = document.getElementById('err-editar-id');
    const camposEditar = document.getElementById('campos-editar');
    const msgError = document.getElementById('msg-editar-error');

    // ocultar mensajes previos
    if (msgError) msgError.style.display = 'none';
    if (camposEditar) camposEditar.style.display = 'none';

    if (!id || isNaN(id)) {
        if (errId) errId.style.display = 'block';
        return;
    }
    if (errId) errId.style.display = 'none';

    const tarea = mockTareas.find(t => t.id === id);

    if (!tarea) {
        if (msgError) msgError.style.display = 'block';
        return;
    }

    // rellenar campos con datos actuales de la tarea
    document.getElementById('editar-nombre').value = tarea.nombre || tarea.titulo || '';
    document.getElementById('editar-descripcion').value = tarea.descripcion || '';
    document.getElementById('editar-estado').value = tarea.estado || '';
    document.getElementById('editar-responsable').value = tarea.responsable || '';

    // convertir fecha DD-MM-YYYY a YYYY-MM-DD para el input date
    if (tarea.fecha) {
        const partes = tarea.fecha.split('-');
        if (partes.length === 3) {
            document.getElementById('editar-fecha').value = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
    } else {
        document.getElementById('editar-fecha').value = tarea.fechaLimite || '';
    }

    tareaEditandoId = id;
    if (camposEditar) camposEditar.style.display = 'block';
}

function limpiarFormEditar() {
    const form = document.getElementById('form-editar');
    if (!form) return;
    form.reset();
    tareaEditandoId = null;
    const camposEditar = document.getElementById('campos-editar');
    if (camposEditar) camposEditar.style.display = 'none';
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    const msg = document.getElementById('msg-editar');
    const msgError = document.getElementById('msg-editar-error');
    if (msg) msg.style.display = 'none';
    if (msgError) msgError.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const formEditar = document.getElementById('form-editar');
    if (!formEditar) return;

    formEditar.addEventListener('submit', function (e) {
        e.preventDefault();

        const camposValidos = [
            validarCampo('editar-nombre', 'err-editar-nombre'),
            validarCampo('editar-estado', 'err-editar-estado'),
        ].every(Boolean);

        if (!camposValidos) return;

        const index = mockTareas.findIndex(t => t.id === tareaEditandoId);
        if (index === -1) return;

        // convertir fecha YYYY-MM-DD a DD-MM-YYYY
        const fechaRaw = document.getElementById('editar-fecha').value;
        let fechaFormateada = '';
        if (fechaRaw) {
            const [y, m, d] = fechaRaw.split('-');
            fechaFormateada = `${d}-${m}-${y}`;
        }

        // actualizar tarea en el array (simulacion PUT)
        mockTareas[index] = {
            ...mockTareas[index],
            nombre:       document.getElementById('editar-nombre').value.trim(),
            titulo:       document.getElementById('editar-nombre').value.trim(),
            descripcion:  document.getElementById('editar-descripcion').value.trim(),
            estado:       document.getElementById('editar-estado').value,
            responsable:  document.getElementById('editar-responsable').value.trim(),
            fecha:        fechaFormateada,
            fechaLimite:  fechaRaw,
        };

        cargarTareas();
        limpiarFormEditar();

        const msg = document.getElementById('msg-editar');
        if (msg) {
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        }
    });
});


// DELETE
let tareaEliminandoId = null;

function confirmarEliminacion() {
    const idInput = document.getElementById('eliminar-id');
    const id = parseInt(idInput?.value);
    const errId = document.getElementById('err-eliminar-id');
    const msgError = document.getElementById('msg-eliminar-error');

    if (msgError) msgError.style.display = 'none';

    if (!id || isNaN(id)) {
        if (errId) errId.style.display = 'block';
        return;
    }
    if (errId) errId.style.display = 'none';

    const tarea = mockTareas.find(t => t.id === id);

    if (!tarea) {
        if (msgError) msgError.style.display = 'block';
        return;
    }

    tareaEliminandoId = id;

    //mostrar info de la tarea
    const infoEl = document.getElementById('modal-tarea-info');
    if (infoEl) {
        infoEl.textContent = `ID: ${tarea.id} — "${tarea.nombre || tarea.titulo}"`;
    }

    document.getElementById('modal-eliminar').style.display = 'block';
}

function cancelarEliminacion() {
    tareaEliminandoId = null;
    document.getElementById('modal-eliminar').style.display = 'none';
}

function ejecutarEliminacion() {
    const index = mockTareas.findIndex(t => t.id === tareaEliminandoId);
    if (index !== -1) {
        mockTareas.splice(index, 1);
        cargarTareas();
    }

    cancelarEliminacion();
    document.getElementById('eliminar-id').value = '';

    const msg = document.getElementById('msg-eliminar');
    if (msg) {
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 3000);
    }
}