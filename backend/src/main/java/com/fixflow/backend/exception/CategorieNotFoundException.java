package com.fixflow.backend.exception;

public class CategorieNotFoundException extends ResourceNotFoundException {

    public CategorieNotFoundException(Long id) {
        super("Catégorie", id);
    }
}
