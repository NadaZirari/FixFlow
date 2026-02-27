package com.fixflow.backend.repository;

import com.fixflow.backend.entity.Abonnement;
import com.fixflow.backend.enums.TypeAbonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AbonnementRepository extends JpaRepository<Abonnement, Long> {
    
    Optional<Abonnement> findByType(TypeAbonnement type);
    
    boolean existsByType(TypeAbonnement type);
}
