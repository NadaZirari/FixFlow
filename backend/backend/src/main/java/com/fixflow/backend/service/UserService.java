package com.fixflow.backend.service;

import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.Role;
import com.fixflow.backend.enums.TypeAbonnement;
import com.fixflow.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        user.setEstActif(true);
        
        return userRepository.save(user);
    }
    
    public User update(Long id, User userDetails) {
        User user = findById(id);
        
        user.setNom(userDetails.getNom());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setTypeAbonnement(userDetails.getTypeAbonnement());
        user.setEstActif(userDetails.getEstActif());
        
        if (userDetails.getMotDePasse() != null && !userDetails.getMotDePasse().isEmpty()) {
            user.setMotDePasse(passwordEncoder.encode(userDetails.getMotDePasse()));
        }
        
        return userRepository.save(user);
    }
    
    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }
    
    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> findActiveAgents() {
        return userRepository.findActiveAgents(Role.SUPPORT);
    }
    
    public List<User> findByTypeAbonnement(TypeAbonnement typeAbonnement) {
        return userRepository.findByTypeAbonnement(typeAbonnement);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public void upgradeToPremium(Long userId) {
        User user = findById(userId);
        user.setTypeAbonnement(TypeAbonnement.PREMIUM);
        userRepository.save(user);
    }
    
    public void downgradeToFree(Long userId) {
        User user = findById(userId);
        user.setTypeAbonnement(TypeAbonnement.GRATUIT);
        userRepository.save(user);
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + email));
    }
}
