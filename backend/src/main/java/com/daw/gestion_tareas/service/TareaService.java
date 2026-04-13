package com.daw.gestion_tareas.service;

import com.daw.gestion_tareas.model.Tarea;
import com.daw.gestion_tareas.dto.TareaDTO;
import com.daw.gestion_tareas.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareaService {

    @Autowired
    private TareaRepository repository;

    // 🔹 ENTITY → DTO
    public TareaDTO toDTO(Tarea tarea) {
        TareaDTO dto = new TareaDTO();
        dto.setId(tarea.getId());
        dto.setTitulo(tarea.getTitulo());
        dto.setDescripcion(tarea.getDescripcion());
        dto.setEstado(tarea.getEstado());
        dto.setResponsable(tarea.getResponsable());
        dto.setFechaLimite(tarea.getFechaLimite());
        return dto;
    }

    // 🔹 DTO → ENTITY
    public Tarea toEntity(TareaDTO dto) {
        Tarea tarea = new Tarea();
        tarea.setId(dto.getId());
        tarea.setTitulo(dto.getTitulo());
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setEstado(dto.getEstado());
        tarea.setResponsable(dto.getResponsable());
        tarea.setFechaLimite(dto.getFechaLimite());
        return tarea;
    }

    // 🔹 CRUD

    public List<TareaDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public TareaDTO obtenerPorId(Long id) {
        Tarea tarea = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        return toDTO(tarea);
    }

    public TareaDTO guardar(TareaDTO dto) {
        Tarea tarea = toEntity(dto);
        return toDTO(repository.save(tarea));
    }

    public TareaDTO actualizar(Long id, TareaDTO dto) {
        Tarea tarea = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));

        tarea.setTitulo(dto.getTitulo());
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setEstado(dto.getEstado());
        tarea.setResponsable(dto.getResponsable());
        tarea.setFechaLimite(dto.getFechaLimite());

        return toDTO(repository.save(tarea));
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}