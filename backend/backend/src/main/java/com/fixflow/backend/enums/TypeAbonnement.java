package com.fixflow.backend.enums;

public enum TypeAbonnement {
    GRATUIT("Gratuit"),
    PREMIUM("Premium");
    
    private final String displayName;
    
    TypeAbonnement(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
