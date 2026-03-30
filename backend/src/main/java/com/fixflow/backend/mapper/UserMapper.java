package com.fixflow.backend.mapper;

import com.fixflow.backend.dto.UserDto;
import com.fixflow.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public static UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        
        return new UserDto(
            user.getId(),
            user.getNom(),
            user.getPrenom(),
            user.getEmail(),
            null, // Ne jamais retourner le mot de passe dans les DTO
            user.getRole(),
            user.getEstActif(),
            user.getDateCreation()
        );
    }
    
    public static User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }
        
        User user = new User();
        user.setId(userDto.getId());
        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setEmail(userDto.getEmail());
        if (userDto.getMotDePasse() != null) {
            user.setMotDePasse(userDto.getMotDePasse());
        }
        user.setRole(userDto.getRole());
        user.setEstActif(userDto.getEstActif());
        user.setDateCreation(userDto.getDateCreation());
        
        return user;
    }
}
