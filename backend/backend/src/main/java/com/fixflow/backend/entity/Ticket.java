package com.fixflow.backend.entity;

import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.enums.PrioriteTicket;
import com.fixflow.backend.enums.CategorieTicket;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ticket")
@EntityListeners(AuditingEntityListener.class)
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 200, message = "Le titre ne doit pas dépasser 200 caractères")
    @Column(name = "titre", nullable = false)
    private String titre;
    
    @NotBlank(message = "La description est obligatoire")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutTicket statut = StatutTicket.OUVERT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priorite", nullable = false)
    private PrioriteTicket priorite = PrioriteTicket.MOYENNE;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "categorie")
    private CategorieTicket categorie;
    
    @Column(name = "chemin_fichier")
    private String cheminFichier;
    
    @CreatedDate
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;
    
    @LastModifiedDate
    @Column(name = "date_resolution")
    private LocalDateTime dateResolution;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"tickets", "commentaires", "notifications"})
    private User user;
    

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"ticket", "auteur"})
    private Set<Commentaire> commentaires = new HashSet<>();
    
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"ticket", "destinataire"})
    private Set<Notification> notifications = new HashSet<>();
    
    // Constructeurs
    public Ticket() {}
    
    public Ticket(String titre, String description, User user) {
        this.titre = titre;
        this.description = description;
        this.user = user;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public StatutTicket getStatut() { return statut; }
    public void setStatut(StatutTicket statut) { this.statut = statut; }
    
    public PrioriteTicket getPriorite() { return priorite; }
    public void setPriorite(PrioriteTicket priorite) { this.priorite = priorite; }
    
    public CategorieTicket getCategorie() { return categorie; }
    public void setCategorie(CategorieTicket categorie) { this.categorie = categorie; }
    
    public String getCheminFichier() { return cheminFichier; }
    public void setCheminFichier(String cheminFichier) { this.cheminFichier = cheminFichier; }
    
    public LocalDateTime getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
    
    public LocalDateTime getDateResolution() { return dateResolution; }
    public void setDateResolution(LocalDateTime dateResolution) { this.dateResolution = dateResolution; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    

    public Set<Commentaire> getCommentaires() { return commentaires; }
    public void setCommentaires(Set<Commentaire> commentaires) { this.commentaires = commentaires; }
    
    public Set<Notification> getNotifications() { return notifications; }
    public void setNotifications(Set<Notification> notifications) { this.notifications = notifications; }
    
    // Méthodes métier

    public void resoudre() {
        this.statut = StatutTicket.RESOLU;
        this.dateResolution = LocalDateTime.now();
    }
    
    public void archiver() {
        this.statut = StatutTicket.ARCHIVE;
    }
    
    public boolean estOuvert() {
        return this.statut == StatutTicket.OUVERT;
    }
    
    public boolean estEnCours() {
        return this.statut == StatutTicket.EN_COURS;
    }
    
    public boolean estResolu() {
        return this.statut == StatutTicket.RESOLU;
    }
    
    public boolean estArchive() {
        return this.statut == StatutTicket.ARCHIVE;
    }
}
