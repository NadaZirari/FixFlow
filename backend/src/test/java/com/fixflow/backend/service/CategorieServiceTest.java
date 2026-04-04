package com.fixflow.backend.service;

import com.fixflow.backend.dto.CategorieRequest;
import com.fixflow.backend.dto.CategorieResponse;
import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.exception.DuplicateResourceException;
import com.fixflow.backend.mapper.CategorieMapper;
import com.fixflow.backend.repository.CategorieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategorieServiceTest {

    @Mock
    private CategorieRepository categorieRepository;

    @Mock
    private CategorieMapper categorieMapper;

    @InjectMocks
    private CategorieService categorieService;

    private Categorie categorie;
    private CategorieResponse categorieResponse;

    @BeforeEach
    void setUp() {
        categorie = new Categorie("Technique");
        categorie.setId(1L);
        
        categorieResponse = new CategorieResponse(1L, "Technique");
    }

    @Test
    @DisplayName("findAll - doit retourner toutes les catégories")
    void findAll_shouldReturnAllCategories() {
        Categorie cat2 = new Categorie("Compte");
        cat2.setId(2L);
        CategorieResponse res2 = new CategorieResponse(2L, "Compte");

        when(categorieRepository.findAll()).thenReturn(Arrays.asList(categorie, cat2));
        when(categorieMapper.toResponseList(anyList())).thenReturn(Arrays.asList(categorieResponse, res2));

        List<CategorieResponse> result = categorieService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getNom()).isEqualTo("Technique");
        assertThat(result.get(1).getNom()).isEqualTo("Compte");
    }

    @Test
    @DisplayName("findById - doit retourner la catégorie quand elle existe")
    void findById_shouldReturnCategorie_whenExists() {
        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));

        Categorie result = categorieService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo("Technique");
    }

    @Test
    @DisplayName("create - doit créer une nouvelle catégorie")
    void create_shouldCreateCategorie() {
        CategorieRequest request = new CategorieRequest("Facturation");
        Categorie newCat = new Categorie("Facturation");
        CategorieResponse response = new CategorieResponse(1L, "Facturation");

        when(categorieRepository.existsByNom("Facturation")).thenReturn(false);
        when(categorieMapper.toEntity(any(CategorieRequest.class))).thenReturn(newCat);
        when(categorieRepository.save(any(Categorie.class))).thenReturn(newCat);
        when(categorieMapper.toResponse(any(Categorie.class))).thenReturn(response);

        CategorieResponse result = categorieService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo("Facturation");
        verify(categorieRepository).save(any(Categorie.class));
    }

    @Test
    @DisplayName("create - doit lancer une exception si le nom existe déjà")
    void create_shouldThrowException_whenNameExists() {
        CategorieRequest request = new CategorieRequest("Technique");

        when(categorieRepository.existsByNom("Technique")).thenReturn(true);

        assertThatThrownBy(() -> categorieService.create(request))
                .isInstanceOf(DuplicateResourceException.class);

        verify(categorieRepository, never()).save(any());
    }

    @Test
    @DisplayName("update - doit mettre à jour le nom de la catégorie")
    void update_shouldUpdateCategorieName() {
        CategorieRequest request = new CategorieRequest("Réseau");
        CategorieResponse response = new CategorieResponse(1L, "Réseau");

        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));
        when(categorieRepository.existsByNom("Réseau")).thenReturn(false);
        when(categorieRepository.save(any(Categorie.class))).thenReturn(categorie);
        when(categorieMapper.toResponse(any(Categorie.class))).thenReturn(response);

        CategorieResponse result = categorieService.update(1L, request);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo("Réseau");
        verify(categorieRepository).save(any(Categorie.class));
    }

    @Test
    @DisplayName("delete - doit supprimer la catégorie")
    void delete_shouldDeleteCategorie() {
        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));

        categorieService.delete(1L);

        verify(categorieRepository).delete(categorie);
    }

    @Test
    @DisplayName("initializeDefaultCategories - doit créer les catégories par défaut quand aucune n'existe")
    void initializeDefaultCategories_shouldCreateDefaults_whenNoneExist() {
        when(categorieRepository.count()).thenReturn(0L);
        when(categorieRepository.existsByNom(anyString())).thenReturn(false);
        when(categorieRepository.save(any(Categorie.class))).thenAnswer(invocation -> invocation.getArgument(0));

        categorieService.initializeDefaultCategories();

        verify(categorieRepository, times(4)).save(any(Categorie.class));
    }
}
