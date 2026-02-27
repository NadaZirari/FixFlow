package com.fixflow.backend.enums;

public enum StatutTicket {
    OUVERT("Ouvert"),
    EN_COURS("En cours"),
    RESOLU("Résolu"),
    ARCHIVE("Archivé");
    
    private final String displayName;
    
    StatutTicket(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
