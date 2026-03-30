package com.fixflow.backend.exception;

public class CommentaireNotFoundException extends ResourceNotFoundException {

    public CommentaireNotFoundException(Long id) {
        super("Commentaire", id);
    }
}
