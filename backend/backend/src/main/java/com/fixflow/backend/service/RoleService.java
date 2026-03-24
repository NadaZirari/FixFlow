package com.fixflow.backend.service;

import com.fixflow.backend.entity.Role;
import com.fixflow.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RoleService {
    
    private final RoleRepository roleRepository;
    
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }
    
    public List<Role> findAll() {
        return roleRepository.findAll();
    }
    
    public Role findById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé avec l'ID: " + id));
    }
    
    public Role findByNom(String nom) {
        return roleRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé avec le nom: " + nom));
    }
    
    public Role create(Role role) {
        if (roleRepository.existsByNom(role.getNom())) {
            throw new RuntimeException("Rôle avec ce nom existe déjà: " + role.getNom());
        }
        return roleRepository.save(role);
    }
    
    public Role update(Long id, Role roleDetails) {
        Role role = findById(id);
        role.setNom(roleDetails.getNom());
        return roleRepository.save(role);
    }
    
    public void delete(Long id) {
        Role role = findById(id);
        roleRepository.delete(role);
    }
    
    public boolean existsByNom(String nom) {
        return roleRepository.existsByNom(nom);
    }
    
    public void initializeDefaultRoles() {
        if (!existsByNom("USER")) {
            Role userRole = new Role("USER");
            roleRepository.save(userRole);
        }
        
        if (!existsByNom("ADMIN")) {
            Role adminRole = new Role("ADMIN");
            roleRepository.save(adminRole);
        }
    }
}
