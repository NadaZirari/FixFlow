package com.fixflow.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "role")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le nom du rôle est obligatoire")
    @Column(name = "nom", nullable = false, unique = true)
    private String nom;
    
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "role_permission",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();
    
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<User> utilisateurs = new HashSet<>();
    
    // Constructeurs
    public Role() {}
    
    public Role(String nom) {
        this.nom = nom;
    }
    
    public Role(String nom, Set<Permission> permissions) {
        this.nom = nom;
        this.permissions = permissions;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public Set<Permission> getPermissions() { return permissions; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }
    
    public Set<User> getUtilisateurs() { return utilisateurs; }
    public void setUtilisateurs(Set<User> utilisateurs) { this.utilisateurs = utilisateurs; }
    
    // Méthodes métier
    public void ajouterPermission(Permission permission) {
        this.permissions.add(permission);
        permission.getRoles().add(this);
    }
    
    public void supprimerPermission(Permission permission) {
        this.permissions.remove(permission);
        permission.getRoles().remove(this);
    }
    
    public boolean aPermission(String nomPermission) {
        return permissions.stream()
                .anyMatch(p -> p.getNom().equals(nomPermission));
    }
    
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
