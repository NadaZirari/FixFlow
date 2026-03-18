package com.fixflow.backend.config;

import com.fixflow.backend.entity.User;
import com.fixflow.backend.service.CategorieService;
import com.fixflow.backend.service.RoleService;
import com.fixflow.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner init(RoleService roleService, CategorieService categorieService, UserService userService) {
        return args -> {
            roleService.initializeDefaultRoles();
            categorieService.initializeDefaultCategories();
            
            // Create default admin if it doesn't exist
            String adminEmail = "admin@fixflow.com";
            if (!userService.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setNom("Admin");
                admin.setEmail(adminEmail);
                admin.setMotDePasse("admin123"); // Will be hashed by userService.create
                admin.setRole(roleService.findByNom("ADMIN"));
                admin.setEstActif(true);
                userService.create(admin);
                System.out.println("Default admin user created: " + adminEmail);
            }
        };
    }
}
