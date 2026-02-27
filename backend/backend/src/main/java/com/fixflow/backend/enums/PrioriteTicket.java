package com.fixflow.backend.enums;

public enum PrioriteTicket {
    FAIBLE("Faible"),
    MOYENNE("Moyenne"),
    HAUTE("Haute");
    
    private final String displayName;
    
    PrioriteTicket(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
