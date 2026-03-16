package com.fixflow.backend.service;

import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.repository.CategorieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public CategorieService(CategorieRepository categorieRepository) {
        this.categorieRepository = categorieRepository;
    }

    public List<Categorie> findAll() {
        return categorieRepository.findAll();
    }

    public Categorie findById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'ID: " + id));
    }

    public Categorie create(Categorie categorie) {
        if (categorieRepository.existsByNom(categorie.getNom())) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà.");
        }
        return categorieRepository.save(categorie);
    }

    public Categorie update(Long id, Categorie categorieDetails) {
        Categorie categorie = findById(id);
        if (!categorie.getNom().equals(categorieDetails.getNom()) && categorieRepository.existsByNom(categorieDetails.getNom())) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà.");
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
        if (categorieRepository.count() == 0) {
            String[] defaultCategories = {"Technique", "Compte", "Facturation", "Autre"};
            for (String nom : defaultCategories) {
                if (!categorieRepository.existsByNom(nom)) {
                    categorieRepository.save(new Categorie(nom));
                }
            }
        }
    }
}
