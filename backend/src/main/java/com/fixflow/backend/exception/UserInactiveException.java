package com.fixflow.backend.exception;

public class UserInactiveException extends RuntimeException {

    public UserInactiveException() {
        super("Le compte utilisateur est désactivé");
    }

    public UserInactiveException(String email) {
        super(String.format("Le compte utilisateur %s est désactivé", email));
    }
}
