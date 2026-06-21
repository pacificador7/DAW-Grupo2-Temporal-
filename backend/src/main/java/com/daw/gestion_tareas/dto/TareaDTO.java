package com.daw.gestion_tareas.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class TareaDTO {

    // READ_ONLY: el id no aparece en el body del POST/PUT en Swagger
    // La BD lo genera automaticamente con BIGSERIAL
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "ID autogenerado por la base de datos")
    private Long id;

    private String titulo;
    private String descripcion;
    private String estado;
    private String responsable;
    private LocalDate fechaLimite;
}