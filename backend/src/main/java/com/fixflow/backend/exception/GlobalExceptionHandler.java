package com.fixflow.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(org.springframework.security.core.AuthenticationException ex) {
        Map<String, String> error = new HashMap<>();
        
        if (ex instanceof DisabledException || (ex.getCause() != null && ex.getCause() instanceof DisabledException)) {
            error.put("error", "ACCOUNT_DISABLED");
            error.put("message", "Votre compte est suspendu. Veuillez contacter l'administrateur.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }
        
        error.put("error", "BAD_CREDENTIALS");
        error.put("message", "Email ou mot de passe incorrect.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "INTERNAL_ERROR");
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
