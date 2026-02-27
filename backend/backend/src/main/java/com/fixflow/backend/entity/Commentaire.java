package com.fixflow.backend.entity;

import com.fixflow.backend.enums.TypeCommentaire;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "commentaire")
@EntityListeners(AuditingEntityListener.class)
public class Commentaire {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le contenu est obligatoire")
    @Column(name = "contenu", nullable = false, columnDefinition = "TEXT")
    private String contenu;
    
    @CreatedDate
    @Column(name = "date", nullable = false, updatable = false)
    private LocalDateTime date;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeCommentaire type = TypeCommentaire.PUBLIC;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auteur_id", nullable = false)
    private User auteur;
    
    // Constructeurs
    public Commentaire() {}
    
    public Commentaire(String contenu, Ticket ticket, User auteur) {
        this.contenu = contenu;
        this.ticket = ticket;
        this.auteur = auteur;
    }
    
    public Commentaire(String contenu, Ticket ticket, User auteur, TypeCommentaire type) {
        this.contenu = contenu;
        this.ticket = ticket;
        this.auteur = auteur;
        this.type = type;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public TypeCommentaire getType() { return type; }
    public void setType(TypeCommentaire type) { this.type = type; }
    
    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }
    
    public User getAuteur() { return auteur; }
    public void setAuteur(User auteur) { this.auteur = auteur; }
    
    // Méthodes métier
    public boolean estInterne() {
        return this.type == TypeCommentaire.INTERNE;
    }
    
    public boolean estPublic() {
        return this.type == TypeCommentaire.PUBLIC;
    }
}
