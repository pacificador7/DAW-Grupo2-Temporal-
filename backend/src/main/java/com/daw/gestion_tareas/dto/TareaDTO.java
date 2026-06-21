package com.daw.gestion_tareas.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TareaDTO {

    // READ_ONLY: el id no aparece en el body del POST/PUT en Swagger
    // La BD lo genera automaticamente con BIGSERIAL
    @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "ID autogenerado por la base de datos")
    private Long id;

    @NotBlank(message = "El título no puede estar vacío")
    @Size(max = 150, message = "El título no puede superar los 150 caracteres")
    private String titulo;

    private String descripcion;

    @NotBlank(message = "El estado es obligatorio")
    @Size(max = 20, message = "El estado no puede superar los 20 caracteres")
    private String estado;

    @Size(max = 100, message = "El responsable no puede superar los 100 caracteres")
    private String responsable;

    private LocalDate fechaLimite;
}