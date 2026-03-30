package com.fixflow.backend.service.interfaces;

import com.fixflow.backend.entity.Categorie;

import java.util.List;

public interface ICategorieService {
    List<Categorie> findAll();
    Categorie findById(Long id);
    Categorie create(Categorie categorie);
    Categorie update(Long id, Categorie categorieDetails);
    void delete(Long id);
    void initializeDefaultCategories();
}
