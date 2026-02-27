package com.fixflow.backend.enums;

public enum TypeCommentaire {
    INTERNE("Interne"),
    PUBLIC("Public");
    
    private final String displayName;
    
    TypeCommentaire(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
