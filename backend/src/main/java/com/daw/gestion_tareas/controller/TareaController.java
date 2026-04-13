package com.daw.gestion_tareas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daw.gestion_tareas.dto.TareaDTO;
import com.daw.gestion_tareas.service.TareaService;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaService service;

    @GetMapping
    public List<TareaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public TareaDTO obtener(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    public TareaDTO guardar(@RequestBody TareaDTO dto) {
        return service.guardar(dto);
    }

    @PutMapping("/{id}")
    public TareaDTO actualizar(@PathVariable Long id, @RequestBody TareaDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}