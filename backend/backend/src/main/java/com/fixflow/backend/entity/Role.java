package com.fixflow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "role")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le nom du rôle est obligatoire")
    @Column(name = "nom", nullable = false, unique = true)
    private String nom;
    
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<User> utilisateurs = new HashSet<>();
    
    // Constructeurs
    public Role() {}
    
    public Role(String nom) {
        this.nom = nom;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public Set<User> getUtilisateurs() { return utilisateurs; }
    public void setUtilisateurs(Set<User> utilisateurs) { this.utilisateurs = utilisateurs; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;
        Role role = (Role) o;
        return nom != null && nom.equals(role.nom);
    }
    
    @Override
    public int hashCode() {
        return nom != null ? nom.hashCode() : 0;
    }
}
