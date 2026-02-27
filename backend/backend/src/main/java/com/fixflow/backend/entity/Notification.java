package com.fixflow.backend.entity;

import com.fixflow.backend.enums.TypeNotification;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@EntityListeners(AuditingEntityListener.class)
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeNotification type;
    
    @NotBlank(message = "Le message est obligatoire")
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "est_lue", nullable = false)
    private Boolean estLue = false;
    
    @CreatedDate
    @Column(name = "date_envoi", nullable = false, updatable = false)
    private LocalDateTime dateEnvoi;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User destinataire;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
    
    // Constructeurs
    public Notification() {}
    
    public Notification(TypeNotification type, String message, User destinataire) {
        this.type = type;
        this.message = message;
        this.destinataire = destinataire;
    }
    
    public Notification(TypeNotification type, String message, User destinataire, Ticket ticket) {
        this.type = type;
        this.message = message;
        this.destinataire = destinataire;
        this.ticket = ticket;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public TypeNotification getType() { return type; }
    public void setType(TypeNotification type) { this.type = type; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Boolean getEstLue() { return estLue; }
    public void setEstLue(Boolean estLue) { this.estLue = estLue; }
    
    public LocalDateTime getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDateTime dateEnvoi) { this.dateEnvoi = dateEnvoi; }
    
    public User getDestinataire() { return destinataire; }
    public void setDestinataire(User destinataire) { this.destinataire = destinataire; }
    
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    
    // Méthodes métier
    public void marquerCommeLue() {
        this.estLue = true;
    }
    
    public void marquerCommeNonLue() {
        this.estLue = false;
    }
    
    public boolean estLue() {
        return Boolean.TRUE.equals(this.estLue);
    }
    
    public boolean estNonLue() {
        return !estLue();
    }
}
