package com.fixflow.backend.enums;

public enum Role {
    USER("Utilisateur"),
    SUPPORT("Support"),
    ADMIN("Administrateur");
    
    private final String displayName;
    
    Role(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
