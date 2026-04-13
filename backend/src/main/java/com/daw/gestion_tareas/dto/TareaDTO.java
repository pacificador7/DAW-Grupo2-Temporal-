package com.daw.gestion_tareas.dto;

import java.time.LocalDate;

import lombok.Data;
@Data

public class TareaDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String estado;
    private String responsable;
    private LocalDate fechaLimite;
}