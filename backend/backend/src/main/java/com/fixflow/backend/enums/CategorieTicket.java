package com.fixflow.backend.enums;

public enum CategorieTicket {
    TECHNIQUE("Technique"),
    COMPTE("Compte"),
    FACTURATION("Facturation"),
    AUTRE("Autre");
    
    private final String displayName;
    
    CategorieTicket(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
