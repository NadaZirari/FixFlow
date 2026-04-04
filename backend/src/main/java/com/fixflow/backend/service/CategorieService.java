package com.fixflow.backend.service;

import com.fixflow.backend.dto.CategorieRequest;
import com.fixflow.backend.dto.CategorieResponse;
import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.mapper.CategorieMapper;
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
    private final CategorieMapper categorieMapper;

    public CategorieService(CategorieRepository categorieRepository, CategorieMapper categorieMapper) {
        this.categorieRepository = categorieRepository;
        this.categorieMapper = categorieMapper;
    }

    @Override
    public List<CategorieResponse> findAll() {
        return categorieMapper.toResponseList(categorieRepository.findAll());
    }

    @Override
    public CategorieResponse getCategorieResponseById(Long id) {
        return categorieMapper.toResponse(findById(id));
    }

    @Override
    public Categorie findById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", id));
    }

    @Override
    public CategorieResponse create(CategorieRequest request) {
        if (categorieRepository.existsByNom(request.getNom())) {
            throw new DuplicateResourceException("Catégorie", "nom", request.getNom());
        }
        Categorie categorie = categorieMapper.toEntity(request);
        return categorieMapper.toResponse(categorieRepository.save(categorie));
    }

    @Override
    public CategorieResponse update(Long id, CategorieRequest request) {
        Categorie categorie = findById(id);
        if (!categorie.getNom().equals(request.getNom()) && categorieRepository.existsByNom(request.getNom())) {
            throw new DuplicateResourceException("Catégorie", "nom", request.getNom());
        }
        categorie.setNom(request.getNom());
        return categorieMapper.toResponse(categorieRepository.save(categorie));
    }

    @Override
    public void delete(Long id) {
        Categorie categorie = findById(id);
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
