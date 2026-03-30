package com.fixflow.backend.exception;

public class UserNotFoundException extends ResourceNotFoundException {

    public UserNotFoundException(Long id) {
        super("Utilisateur", id);
    }

    public UserNotFoundException(String email) {
        super("Utilisateur", "email", email);
    }
}
