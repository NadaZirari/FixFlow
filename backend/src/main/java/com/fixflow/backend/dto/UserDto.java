package com.fixflow.backend.dto;

import com.fixflow.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private Role role;
    private Boolean estActif;
    private LocalDateTime dateCreation;
    
    // Constructeur sans mot de passe pour les réponses API
    public UserDto(Long id, String nom, String prenom, String email, Role role, Boolean estActif, LocalDateTime dateCreation) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.estActif = estActif;
        this.dateCreation = dateCreation;
    }
}
