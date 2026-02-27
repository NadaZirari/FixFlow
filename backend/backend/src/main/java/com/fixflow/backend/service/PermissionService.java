package com.fixflow.backend.service;

import com.fixflow.backend.entity.Permission;
import com.fixflow.backend.repository.PermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PermissionService {
    
    private final PermissionRepository permissionRepository;
    
    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    
    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }
    
    public Permission findById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission non trouvée avec l'ID: " + id));
    }
    
    public Permission findByNom(String nom) {
        return permissionRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Permission non trouvée avec le nom: " + nom));
    }
    
    public Permission create(Permission permission) {
        if (permissionRepository.existsByNom(permission.getNom())) {
            throw new RuntimeException("Permission avec ce nom existe déjà: " + permission.getNom());
        }
        return permissionRepository.save(permission);
    }
    
    public Permission update(Long id, Permission permissionDetails) {
        Permission permission = findById(id);
        
        permission.setNom(permissionDetails.getNom());
        permission.setDescription(permissionDetails.getDescription());
        
        return permissionRepository.save(permission);
    }
    
    public void delete(Long id) {
        Permission permission = findById(id);
        permissionRepository.delete(permission);
    }
    
    public boolean existsByNom(String nom) {
        return permissionRepository.existsByNom(nom);
    }
    
    public void initializeDefaultPermissions() {
        String[] defaultPermissions = {
            "TICKET_CREATE", "TICKET_READ", "TICKET_UPDATE", "TICKET_DELETE",
            "TICKET_ASSIGN", "TICKET_RESOLVE", "TICKET_ARCHIVE",
            "COMMENT_CREATE", "COMMENT_READ", "COMMENT_UPDATE", "COMMENT_DELETE",
            "USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE",
            "ROLE_CREATE", "ROLE_READ", "ROLE_UPDATE", "ROLE_DELETE",
            "ADMIN_PANEL", "STATISTICS_READ", "SYSTEM_CONFIG"
        };
        
        for (String permissionName : defaultPermissions) {
            if (!existsByNom(permissionName)) {
                Permission permission = new Permission(permissionName, "Permission par défaut: " + permissionName);
                permissionRepository.save(permission);
            }
        }
    }
}
