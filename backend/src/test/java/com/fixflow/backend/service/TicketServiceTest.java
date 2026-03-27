package com.fixflow.backend.service;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.entity.Role;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.PrioriteTicket;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.repository.CategorieRepository;
import com.fixflow.backend.repository.TicketRepository;
import com.fixflow.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategorieRepository categorieRepository;

    @InjectMocks
    private TicketService ticketService;

    private User user;
    private Ticket ticket;
    private Categorie categorie;

    @BeforeEach
    void setUp() {
        Role role = new Role("USER");
        role.setId(1L);

        user = new User("Nada", "nada@test.com", "password");
        user.setId(1L);
        user.setRole(role);

        categorie = new Categorie("Technique");
        categorie.setId(1L);

        ticket = new Ticket("Bug login", "Le login ne fonctionne pas", user);
        ticket.setId(1L);
        ticket.setPriorite(PrioriteTicket.HAUTE);
        ticket.setCategorie(categorie);
        ticket.setDateCreation(LocalDateTime.now());
    }

    @Test
    @DisplayName("findById - doit retourner le ticket quand il existe")
    void findById_shouldReturnTicket_whenExists() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        Ticket result = ticketService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitre()).isEqualTo("Bug login");
        assertThat(result.getDescription()).isEqualTo("Le login ne fonctionne pas");
    }

    @Test
    @DisplayName("findById - doit lancer une exception quand le ticket n'existe pas")
    void findById_shouldThrowException_whenNotFound() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Ticket non trouvé");
    }

    @Test
    @DisplayName("getTicketResponseById - doit retourner un TicketResponse")
    void getTicketResponseById_shouldReturnTicketResponse() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        TicketResponse result = ticketService.getTicketResponseById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitre()).isEqualTo("Bug login");
        assertThat(result.getPriorite()).isEqualTo(PrioriteTicket.HAUTE);
        assertThat(result.getCategorieNom()).isEqualTo("Technique");
        assertThat(result.getUserNom()).isEqualTo("Nada");
    }

    @Test
    @DisplayName("getAllTickets - doit retourner tous les tickets en TicketResponse")
    void getAllTickets_shouldReturnAllTicketResponses() {
        Ticket ticket2 = new Ticket("Erreur page", "Page blanche", user);
        ticket2.setId(2L);
        ticket2.setPriorite(PrioriteTicket.MOYENNE);
        ticket2.setDateCreation(LocalDateTime.now());

        when(ticketRepository.findAll()).thenReturn(Arrays.asList(ticket, ticket2));

        List<TicketResponse> result = ticketService.getAllTickets();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitre()).isEqualTo("Bug login");
        assertThat(result.get(1).getTitre()).isEqualTo("Erreur page");
    }

    @Test
    @DisplayName("updateTicket - doit mettre à jour le ticket")
    void updateTicket_shouldUpdateTicket() {
        TicketRequest request = TicketRequest.builder()
                .titre("Bug login corrigé")
                .description("Description mise à jour")
                .priorite(PrioriteTicket.MOYENNE)
                .categorieId(1L)
                .build();

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        TicketResponse result = ticketService.updateTicket(1L, request);

        assertThat(result).isNotNull();
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    @DisplayName("updateTicket - doit lancer une exception si le ticket n'existe pas")
    void updateTicket_shouldThrowException_whenTicketNotFound() {
        TicketRequest request = TicketRequest.builder()
                .titre("Titre")
                .description("Desc")
                .priorite(PrioriteTicket.FAIBLE)
                .build();

        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketService.updateTicket(99L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Ticket non trouvé");
    }

    @Test
    @DisplayName("updateStatus - doit changer le statut en EN_COURS")
    void updateStatus_shouldChangeStatusToEnCours() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        TicketResponse result = ticketService.updateStatus(1L, StatutTicket.EN_COURS);

        assertThat(result).isNotNull();
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    @DisplayName("updateStatus - doit résoudre le ticket et définir la date de résolution")
    void updateStatus_shouldResolveTicketAndSetDate() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ticketService.updateStatus(1L, StatutTicket.RESOLU);

        assertThat(ticket.getStatut()).isEqualTo(StatutTicket.RESOLU);
        assertThat(ticket.getDateResolution()).isNotNull();
    }

    @Test
    @DisplayName("updateStatus - doit archiver le ticket")
    void updateStatus_shouldArchiveTicket() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ticketService.updateStatus(1L, StatutTicket.ARCHIVE);

        assertThat(ticket.getStatut()).isEqualTo(StatutTicket.ARCHIVE);
    }

    @Test
    @DisplayName("getTicketResponseById - doit retourner null pour categorieNom quand pas de catégorie")
    void getTicketResponseById_shouldReturnNullCategorie_whenNoCategorie() {
        ticket.setCategorie(null);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        TicketResponse result = ticketService.getTicketResponseById(1L);

        assertThat(result.getCategorieNom()).isNull();
        assertThat(result.getCategorieId()).isNull();
    }
}
