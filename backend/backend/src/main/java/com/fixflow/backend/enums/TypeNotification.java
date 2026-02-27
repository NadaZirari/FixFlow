package com.fixflow.backend.enums;

public enum TypeNotification {
    NOUVEAU_TICKET("Nouveau ticket"),
    CHANGEMENT_STATUT("Changement de statut"),
    NOUVEAU_COMMENTAIRE("Nouveau commentaire"),
    TICKET_ATTRIBUE("Ticket attribué"),
    TICKET_RESOLU("Ticket résolu");
    
    private final String displayName;
    
    TypeNotification(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
