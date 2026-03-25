package com.fixflow.backend.service;

import com.fixflow.backend.entity.Role;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private UserService userService;

    private User user;
    private Role roleUser;
    private Role roleAdmin;

    @BeforeEach
    void setUp() {
        roleUser = new Role("USER");
        roleUser.setId(1L);

        roleAdmin = new Role("ADMIN");
        roleAdmin.setId(2L);

        user = new User("Nada", "nada@test.com", "password123");
        user.setId(1L);
        user.setRole(roleUser);
        user.setEstActif(true);
    }

    @Test
    @DisplayName("findAll - doit retourner la liste de tous les utilisateurs")
    void findAll_shouldReturnAllUsers() {
        User user2 = new User("Ali", "ali@test.com", "pass");
        user2.setId(2L);
        user2.setRole(roleUser);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user, user2));

        List<User> result = userService.findAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getNom()).isEqualTo("Nada");
        assertThat(result.get(1).getNom()).isEqualTo("Ali");
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById - doit retourner l'utilisateur quand il existe")
    void findById_shouldReturnUser_whenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getNom()).isEqualTo("Nada");
        assertThat(result.getEmail()).isEqualTo("nada@test.com");
    }

    @Test
    @DisplayName("findById - doit lancer une exception quand l'utilisateur n'existe pas")
    void findById_shouldThrowException_whenNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Utilisateur non trouvé");
    }

    @Test
    @DisplayName("findByEmail - doit retourner l'utilisateur par email")
    void findByEmail_shouldReturnUser() {
        when(userRepository.findByEmail("nada@test.com")).thenReturn(Optional.of(user));

        User result = userService.findByEmail("nada@test.com");

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("nada@test.com");
    }

    @Test
    @DisplayName("findByEmail - doit lancer une exception quand l'email n'existe pas")
    void findByEmail_shouldThrowException_whenNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findByEmail("unknown@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Utilisateur non trouvé");
    }

    @Test
    @DisplayName("create - doit créer un utilisateur avec le rôle USER par défaut")
    void create_shouldCreateUser_withDefaultRole() {
        User newUser = new User("Sara", "sara@test.com", "pass123");

        when(userRepository.existsByEmail("sara@test.com")).thenReturn(false);
        when(roleService.findByNom("USER")).thenReturn(roleUser);
        when(passwordEncoder.encode("pass123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        User result = userService.create(newUser);

        assertThat(result).isNotNull();
        verify(passwordEncoder).encode("pass123");
        verify(roleService).findByNom("USER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("create - doit lancer une exception si l'email existe déjà")
    void create_shouldThrowException_whenEmailExists() {
        User newUser = new User("Sara", "nada@test.com", "pass123");

        when(userRepository.existsByEmail("nada@test.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.create(newUser))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email déjà utilisé");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("create - doit assigner le rôle spécifié si fourni")
    void create_shouldAssignSpecifiedRole() {
        User newUser = new User("Admin", "admin@test.com", "pass123");
        Role adminRole = new Role("ADMIN");
        newUser.setRole(adminRole);

        when(userRepository.existsByEmail("admin@test.com")).thenReturn(false);
        when(roleService.findByNom("ADMIN")).thenReturn(roleAdmin);
        when(passwordEncoder.encode("pass123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        userService.create(newUser);

        verify(roleService).findByNom("ADMIN");
    }

    @Test
    @DisplayName("update - doit mettre à jour les informations de l'utilisateur")
    void update_shouldUpdateUserDetails() {
        User updatedDetails = new User();
        updatedDetails.setNom("Nada Updated");
        updatedDetails.setPrenom("Prenom");
        updatedDetails.setEmail("nada.new@test.com");
        updatedDetails.setEstActif(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.saveAndFlush(any(User.class))).thenReturn(user);

        User result = userService.update(1L, updatedDetails);

        assertThat(result).isNotNull();
        verify(userRepository).saveAndFlush(any(User.class));
    }

    @Test
    @DisplayName("update - doit encoder le mot de passe si fourni")
    void update_shouldEncodePassword_whenProvided() {
        User updatedDetails = new User();
        updatedDetails.setNom("Nada");
        updatedDetails.setEmail("nada@test.com");
        updatedDetails.setEstActif(true);
        updatedDetails.setMotDePasse("newPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPass");
        when(userRepository.saveAndFlush(any(User.class))).thenReturn(user);

        userService.update(1L, updatedDetails);

        verify(passwordEncoder).encode("newPassword");
    }

    @Test
    @DisplayName("toggleStatus - doit inverser le statut actif de l'utilisateur")
    void toggleStatus_shouldToggleUserActiveStatus() {
        user.setEstActif(true);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.saveAndFlush(any(User.class))).thenReturn(user);

        User result = userService.toggleStatus(1L);

        assertThat(result.getEstActif()).isFalse();
        verify(userRepository).saveAndFlush(any(User.class));
    }

    @Test
    @DisplayName("delete - doit supprimer l'utilisateur")
    void delete_shouldDeleteUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.delete(1L);

        verify(userRepository).delete(user);
    }

    @Test
    @DisplayName("findByRole - doit retourner les utilisateurs par rôle")
    void findByRole_shouldReturnUsersByRole() {
        when(roleService.findByNom("USER")).thenReturn(roleUser);
        when(userRepository.findByRole(roleUser)).thenReturn(List.of(user));

        List<User> result = userService.findByRole("USER");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getNom()).isEqualTo("Nada");
    }

    @Test
    @DisplayName("existsByEmail - doit retourner true si l'email existe")
    void existsByEmail_shouldReturnTrue_whenEmailExists() {
        when(userRepository.existsByEmail("nada@test.com")).thenReturn(true);

        boolean result = userService.existsByEmail("nada@test.com");

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("existsByEmail - doit retourner false si l'email n'existe pas")
    void existsByEmail_shouldReturnFalse_whenEmailDoesNotExist() {
        when(userRepository.existsByEmail("unknown@test.com")).thenReturn(false);

        boolean result = userService.existsByEmail("unknown@test.com");

        assertThat(result).isFalse();
    }
}
