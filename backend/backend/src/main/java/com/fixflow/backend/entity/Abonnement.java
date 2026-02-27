package com.fixflow.backend.entity;

import com.fixflow.backend.enums.TypeAbonnement;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "abonnement")
public class Abonnement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, unique = true)
    private TypeAbonnement type;
    
    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.0", message = "Le prix doit être positif")
    @Column(name = "prix", nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;
    
    @NotNull(message = "La durée est obligatoire")
    @Min(value = 1, message = "La durée doit être d'au moins 1 mois")
    @Column(name = "duree_mois", nullable = false)
    private Integer dureeMois;
    
    @NotNull(message = "Le nombre maximum de tickets est obligatoire")
    @Min(value = 0, message = "Le nombre maximum de tickets doit être positif")
    @Column(name = "max_tickets", nullable = false)
    private Integer maxTickets;
    
    @Column(name = "stripe_price_id")
    private String stripePriceId;
    
    @OneToMany(mappedBy = "abonnement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<User> utilisateurs = new HashSet<>();
    
    // Constructeurs
    public Abonnement() {}
    
    public Abonnement(TypeAbonnement type, BigDecimal prix, Integer dureeMois, Integer maxTickets) {
        this.type = type;
        this.prix = prix;
        this.dureeMois = dureeMois;
        this.maxTickets = maxTickets;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public TypeAbonnement getType() { return type; }
    public void setType(TypeAbonnement type) { this.type = type; }
    
    public BigDecimal getPrix() { return prix; }
    public void setPrix(BigDecimal prix) { this.prix = prix; }
    
    public Integer getDureeMois() { return dureeMois; }
    public void setDureeMois(Integer dureeMois) { this.dureeMois = dureeMois; }
    
    public Integer getMaxTickets() { return maxTickets; }
    public void setMaxTickets(Integer maxTickets) { this.maxTickets = maxTickets; }
    
    public String getStripePriceId() { return stripePriceId; }
    public void setStripePriceId(String stripePriceId) { this.stripePriceId = stripePriceId; }
    
    public Set<User> getUtilisateurs() { return utilisateurs; }
    public void setUtilisateurs(Set<User> utilisateurs) { this.utilisateurs = utilisateurs; }
    
    // Méthodes métier
    public boolean estGratuit() {
        return this.type == TypeAbonnement.GRATUIT;
    }
    
    public boolean estPremium() {
        return this.type == TypeAbonnement.PREMIUM;
    }
    
    public boolean aLimiteTickets() {
        return this.maxTickets != null && this.maxTickets > 0;
    }
}
