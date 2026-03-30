package com.fixflow.backend.exception;

public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException() {
        super("Accès refusé");
    }

    public AccessDeniedException(String message) {
        super(message);
    }
}
