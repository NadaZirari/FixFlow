package com.fixflow.backend.service;

import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.repository.CategorieRepository;
import com.fixflow.backend.service.interfaces.ICategorieService;
import com.fixflow.backend.exception.ResourceNotFoundException;
import com.fixflow.backend.exception.DuplicateResourceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategorieService implements ICategorieService {

    private static final Logger logger = LoggerFactory.getLogger(CategorieService.class);
    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public List<Categorie> findAll() {
        return categorieRepository.findAll();
    }

    public Categorie findById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", id));
    }

    public Categorie create(Categorie categorie) {
        if (categorieRepository.existsByNom(categorie.getNom())) {
            throw new DuplicateResourceException("Catégorie", "nom", categorie.getNom());
        }
        return categorieRepository.save(categorie);
    }

    public Categorie update(Long id, Categorie categorieDetails) {
        Categorie categorie = findById(id);
        if (!categorie.getNom().equals(categorieDetails.getNom()) && categorieRepository.existsByNom(categorieDetails.getNom())) {
            throw new DuplicateResourceException("Catégorie", "nom", categorieDetails.getNom());
        }
        categorie.setNom(categorieDetails.getNom());
        return categorieRepository.save(categorie);
    }

    public void delete(Long id) {
        Categorie categorie = findById(id);
        // Ensure no tickets are attached before deleting in a real-world scenario (can be handled by DB or explicit checks)
        categorieRepository.delete(categorie);
    }

    public void initializeDefaultCategories() {
        logger.info("Vérification de l'initialisation des catégories...");
        if (categorieRepository.count() == 0) {
            logger.info("Aucune catégorie trouvée, initialisation des valeurs par défaut...");
            String[] defaultCategories = {"Technique", "Compte", "Facturation", "Autre"};
            for (String nom : defaultCategories) {
                if (!categorieRepository.existsByNom(nom)) {
                    categorieRepository.save(new Categorie(nom));
                    logger.info("Catégorie créée: {}", nom);
                }
            }
        } else {
            logger.info("Catégories déjà présentes: {}", categorieRepository.count());
        }
    }
}
