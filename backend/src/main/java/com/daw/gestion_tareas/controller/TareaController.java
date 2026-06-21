package com.daw.gestion_tareas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.daw.gestion_tareas.dto.TareaDTO;
import com.daw.gestion_tareas.service.TareaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Tareas", description = "CRUD de gestión de tareas")
@RestController
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaService service;

    @Operation(summary = "Listar todas las tareas")
    @GetMapping
    public ResponseEntity<List<TareaDTO>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @Operation(summary = "Obtener una tarea por ID")
    @GetMapping("/{id}")
    public ResponseEntity<TareaDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @Operation(summary = "Crear una nueva tarea")
    @PostMapping
    public ResponseEntity<TareaDTO> guardar(@Valid @RequestBody TareaDTO dto) {
        TareaDTO creada = service.guardar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @Operation(summary = "Actualizar una tarea existente")
    @PutMapping("/{id}")
    public ResponseEntity<TareaDTO> actualizar(@PathVariable Long id, @Valid @RequestBody TareaDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @Operation(summary = "Eliminar una tarea")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}