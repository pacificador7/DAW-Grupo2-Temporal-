package com.daw.gestion_tareas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.daw.gestion_tareas.dto.TareaDTO;
import com.daw.gestion_tareas.service.TareaService;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Tareas", description = "CRUD de gestión de tareas")
@RestController
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaService service;

    @Operation(summary = "Listar todas las tareas")
    @GetMapping
    public List<TareaDTO> listar() {
        return service.listar();
    }

    @Operation(summary = "Obtener una tarea por ID")
    @GetMapping("/{id}")
    public TareaDTO obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @Operation(summary = "Crear una nueva tarea")
    @PostMapping
    public TareaDTO guardar(@RequestBody TareaDTO dto) {
        return service.guardar(dto);
    }

    @Operation(summary = "Actualizar una tarea existente")
    @PutMapping("/{id}")
    public TareaDTO actualizar(@PathVariable Long id, @RequestBody TareaDTO dto) {
        return service.actualizar(id, dto);
    }

    @Operation(summary = "Eliminar una tarea")
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}