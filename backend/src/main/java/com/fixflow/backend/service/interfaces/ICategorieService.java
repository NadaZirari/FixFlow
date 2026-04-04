package com.fixflow.backend.service.interfaces;

import com.fixflow.backend.dto.CategorieRequest;
import com.fixflow.backend.dto.CategorieResponse;
import com.fixflow.backend.entity.Categorie;

import java.util.List;

public interface ICategorieService {
    List<CategorieResponse> findAll();
    Categorie findById(Long id);
    CategorieResponse getCategorieResponseById(Long id);
    CategorieResponse create(CategorieRequest request);
    CategorieResponse update(Long id, CategorieRequest request);
    void delete(Long id);
    void initializeDefaultCategories();
}
