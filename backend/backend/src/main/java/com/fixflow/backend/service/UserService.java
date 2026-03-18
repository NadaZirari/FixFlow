package com.fixflow.backend.service;

import com.fixflow.backend.entity.User;
import com.fixflow.backend.entity.Role;
import com.fixflow.backend.repository.UserRepository;
import com.fixflow.backend.service.RoleService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + id));
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email: " + email));
    }
    
    public User create(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email déjà utilisé: " + user.getEmail());
        }
        
        if (user.getRole() == null || user.getRole().getNom() == null) {
            user.setRole(roleService.findByNom("USER"));
        } else {
            user.setRole(roleService.findByNom(user.getRole().getNom()));
        }
        
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        user.setEstActif(true);
        
        return userRepository.save(user);
    }
    
    public User update(Long id, User userDetails) {
        User user = findById(id);
        
        user.setNom(userDetails.getNom());
        user.setEmail(userDetails.getEmail());
        
        if (userDetails.getRole() != null && userDetails.getRole().getNom() != null) {
            user.setRole(roleService.findByNom(userDetails.getRole().getNom()));
        }
        user.setEstActif(userDetails.getEstActif());
        
        if (userDetails.getMotDePasse() != null && !userDetails.getMotDePasse().isEmpty()) {
            user.setMotDePasse(passwordEncoder.encode(userDetails.getMotDePasse()));
        }
        
        return userRepository.save(user);
    }
    
    public User toggleStatus(Long id) {
        User user = findById(id);
        user.setEstActif(!user.getEstActif());
        return userRepository.save(user);
    }
    
    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }
    
    public List<User> findByRole(String roleNom) {
        Role role = roleService.findByNom(roleNom);
        return userRepository.findByRole(role);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
