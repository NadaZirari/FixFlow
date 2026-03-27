package com.fixflow.backend.service;

import com.fixflow.backend.entity.Categorie;
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

    @InjectMocks
    private CategorieService categorieService;

    private Categorie categorie;

    @BeforeEach
    void setUp() {
        categorie = new Categorie("Technique");
        categorie.setId(1L);
    }

    @Test
    @DisplayName("findAll - doit retourner toutes les catégories")
    void findAll_shouldReturnAllCategories() {
        Categorie cat2 = new Categorie("Compte");
        cat2.setId(2L);

        when(categorieRepository.findAll()).thenReturn(Arrays.asList(categorie, cat2));

        List<Categorie> result = categorieService.findAll();

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
    @DisplayName("findById - doit lancer une exception quand la catégorie n'existe pas")
    void findById_shouldThrowException_whenNotFound() {
        when(categorieRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categorieService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Catégorie non trouvée");
    }

    @Test
    @DisplayName("create - doit créer une nouvelle catégorie")
    void create_shouldCreateCategorie() {
        Categorie newCat = new Categorie("Facturation");

        when(categorieRepository.existsByNom("Facturation")).thenReturn(false);
        when(categorieRepository.save(any(Categorie.class))).thenReturn(newCat);

        Categorie result = categorieService.create(newCat);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo("Facturation");
        verify(categorieRepository).save(newCat);
    }

    @Test
    @DisplayName("create - doit lancer une exception si le nom existe déjà")
    void create_shouldThrowException_whenNameExists() {
        Categorie duplicateCat = new Categorie("Technique");

        when(categorieRepository.existsByNom("Technique")).thenReturn(true);

        assertThatThrownBy(() -> categorieService.create(duplicateCat))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("catégorie avec ce nom existe déjà");

        verify(categorieRepository, never()).save(any());
    }

    @Test
    @DisplayName("update - doit mettre à jour le nom de la catégorie")
    void update_shouldUpdateCategorieName() {
        Categorie updatedDetails = new Categorie("Réseau");

        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));
        when(categorieRepository.existsByNom("Réseau")).thenReturn(false);
        when(categorieRepository.save(any(Categorie.class))).thenReturn(categorie);

        Categorie result = categorieService.update(1L, updatedDetails);

        assertThat(result).isNotNull();
        verify(categorieRepository).save(any(Categorie.class));
    }

    @Test
    @DisplayName("update - doit lancer une exception si le nouveau nom existe déjà")
    void update_shouldThrowException_whenNewNameExists() {
        Categorie updatedDetails = new Categorie("Compte");

        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));
        when(categorieRepository.existsByNom("Compte")).thenReturn(true);

        assertThatThrownBy(() -> categorieService.update(1L, updatedDetails))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("catégorie avec ce nom existe déjà");
    }

    @Test
    @DisplayName("update - doit permettre la mise à jour avec le même nom")
    void update_shouldAllowSameName() {
        Categorie updatedDetails = new Categorie("Technique");

        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));
        when(categorieRepository.save(any(Categorie.class))).thenReturn(categorie);

        Categorie result = categorieService.update(1L, updatedDetails);

        assertThat(result).isNotNull();
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

    @Test
    @DisplayName("initializeDefaultCategories - ne doit rien créer quand des catégories existent")
    void initializeDefaultCategories_shouldNotCreate_whenCategoriesExist() {
        when(categorieRepository.count()).thenReturn(4L);

        categorieService.initializeDefaultCategories();

        verify(categorieRepository, never()).save(any(Categorie.class));
    }
}
