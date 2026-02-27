package com.fixflow.backend.service;

import com.fixflow.backend.entity.Abonnement;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeAbonnement;
import com.fixflow.backend.repository.AbonnementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AbonnementService {
    
    private final AbonnementRepository abonnementRepository;
    private final UserService userService;
    
    public AbonnementService(AbonnementRepository abonnementRepository, UserService userService) {
        this.abonnementRepository = abonnementRepository;
        this.userService = userService;
    }
    
    public List<Abonnement> findAll() {
        return abonnementRepository.findAll();
    }
    
    public Abonnement findById(Long id) {
        return abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement non trouvé avec l'ID: " + id));
    }
    
    public Abonnement findByType(TypeAbonnement type) {
        return abonnementRepository.findByType(type)
                .orElseThrow(() -> new RuntimeException("Abonnement non trouvé avec le type: " + type));
    }
    
    public Abonnement create(Abonnement abonnement) {
        if (abonnementRepository.existsByType(abonnement.getType())) {
            throw new RuntimeException("Abonnement avec ce type existe déjà: " + abonnement.getType());
        }
        return abonnementRepository.save(abonnement);
    }
    
    public Abonnement update(Long id, Abonnement abonnementDetails) {
        Abonnement abonnement = findById(id);
        
        abonnement.setType(abonnementDetails.getType());
        abonnement.setPrix(abonnementDetails.getPrix());
        abonnement.setDureeMois(abonnementDetails.getDureeMois());
        abonnement.setMaxTickets(abonnementDetails.getMaxTickets());
        abonnement.setStripePriceId(abonnementDetails.getStripePriceId());
        
        return abonnementRepository.save(abonnement);
    }
    
    public void delete(Long id) {
        Abonnement abonnement = findById(id);
        abonnementRepository.delete(abonnement);
    }
    
    public boolean existsByType(TypeAbonnement type) {
        return abonnementRepository.existsByType(type);
    }
    
    public void subscribeUser(Long userId, TypeAbonnement type) {
        User user = userService.findById(userId);
        Abonnement abonnement = findByType(type);
        
        user.setTypeAbonnement(type);
        user.setAbonnement(abonnement);
        
        userService.update(userId, user);
    }
    
    public void unsubscribeUser(Long userId) {
        User user = userService.findById(userId);
        Abonnement gratuitAbonnement = findByType(TypeAbonnement.GRATUIT);
        
        user.setTypeAbonnement(TypeAbonnement.GRATUIT);
        user.setAbonnement(gratuitAbonnement);
        
        userService.update(userId, user);
    }
    
    public boolean canUserCreateTicket(Long userId) {
        User user = userService.findById(userId);
        return user.peutCreerTicket();
    }
    
    public void initializeDefaultSubscriptions() {
        if (!existsByType(TypeAbonnement.GRATUIT)) {
            Abonnement gratuit = new Abonnement(
                TypeAbonnement.GRATUIT, 
                BigDecimal.ZERO, 
                12, 
                3
            );
            gratuit.setStripePriceId(null);
            abonnementRepository.save(gratuit);
        }
        
        if (!existsByType(TypeAbonnement.PREMIUM)) {
            Abonnement premium = new Abonnement(
                TypeAbonnement.PREMIUM, 
                new BigDecimal("29.99"), 
                1, 
                -1
            );
            premium.setStripePriceId("price_premium_monthly");
            abonnementRepository.save(premium);
        }
    }
}
