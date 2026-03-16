package com.fixflow.backend.config;

import com.fixflow.backend.service.CategorieService;
import com.fixflow.backend.service.RoleService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner init(RoleService roleService, CategorieService categorieService) {
        return args -> {
            roleService.initializeDefaultRoles();
            categorieService.initializeDefaultCategories();
        };
    }
}
