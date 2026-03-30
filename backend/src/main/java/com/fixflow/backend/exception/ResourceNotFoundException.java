package com.fixflow.backend.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(String.format("%s non trouvé(e) avec l'ID: %d", resourceName, id));
    }

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s non trouvé(e) avec %s: %s", resourceName, fieldName, fieldValue));
    }
}
