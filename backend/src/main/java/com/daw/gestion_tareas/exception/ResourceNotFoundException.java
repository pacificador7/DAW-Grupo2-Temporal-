package com.daw.gestion_tareas.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepcion lanzada cuando un recurso solicitado no existe en la base de datos.
 * La anotacion @ResponseStatus provoca que Spring devuelva HTTP 404 automaticamente,
 * en lugar del generico HTTP 500 que lanzaria RuntimeException.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }
}
