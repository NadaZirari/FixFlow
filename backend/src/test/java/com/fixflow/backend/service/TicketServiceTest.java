package com.fixflow.backend.service;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.entity.Categorie;
import com.fixflow.backend.entity.Role;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.PrioriteTicket;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.mapper.TicketMapper;
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
import java.util.Collections;
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

    @Mock
    private TicketMapper ticketMapper;

    @InjectMocks
    private TicketService ticketService;

    private User user;
    private Ticket ticket;
    private Categorie categorie;
    private TicketResponse ticketResponse;

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

        ticketResponse = TicketResponse.builder()
                .id(1L)
                .titre("Bug login")
                .description("Le login ne fonctionne pas")
                .priorite(PrioriteTicket.HAUTE)
                .categorieNom("Technique")
                .userNom("Nada")
                .build();
    }

    @Test
    @DisplayName("findById - doit retourner le ticket quand il existe")
    void findById_shouldReturnTicket_whenExists() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        Ticket result = ticketService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitre()).isEqualTo("Bug login");
    }

    @Test
    @DisplayName("getTicketResponseById - doit retourner un TicketResponse")
    void getTicketResponseById_shouldReturnTicketResponse() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketMapper.toResponse(any(Ticket.class))).thenReturn(ticketResponse);

        TicketResponse result = ticketService.getTicketResponseById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitre()).isEqualTo("Bug login");
        assertThat(result.getCategorieNom()).isEqualTo("Technique");
    }

    @Test
    @DisplayName("getAllTickets - doit retourner tous les tickets en TicketResponse")
    void getAllTickets_shouldReturnAllTicketResponses() {
        Ticket ticket2 = new Ticket("Erreur page", "Page blanche", user);
        TicketResponse res2 = TicketResponse.builder().titre("Erreur page").build();

        when(ticketRepository.findAll()).thenReturn(Arrays.asList(ticket, ticket2));
        when(ticketMapper.toResponse(ticket)).thenReturn(ticketResponse);
        when(ticketMapper.toResponse(ticket2)).thenReturn(res2);

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

        TicketResponse updatedRes = TicketResponse.builder().titre("Bug login corrigé").build();

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(categorieRepository.findById(1L)).thenReturn(Optional.of(categorie));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);
        when(ticketMapper.toResponse(any(Ticket.class))).thenReturn(updatedRes);

        TicketResponse result = ticketService.updateTicket(1L, request);

        assertThat(result).isNotNull();
        assertThat(result.getTitre()).isEqualTo("Bug login corrigé");
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    @DisplayName("updateStatus - doit changer le statut en EN_COURS")
    void updateStatus_shouldChangeStatusToEnCours() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);
        when(ticketMapper.toResponse(any(Ticket.class))).thenReturn(ticketResponse);

        TicketResponse result = ticketService.updateStatus(1L, StatutTicket.EN_COURS);

        assertThat(result).isNotNull();
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    @DisplayName("updateStatus - doit résoudre le ticket")
    void updateStatus_shouldResolveTicketAndSetDate() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ticketMapper.toResponse(any(Ticket.class))).thenReturn(ticketResponse);

        ticketService.updateStatus(1L, StatutTicket.RESOLU);

        assertThat(ticket.getStatut()).isEqualTo(StatutTicket.RESOLU);
        assertThat(ticket.getDateResolution()).isNotNull();
    }

    @Test
    @DisplayName("getTicketResponseById - doit retourner null pour categorieNom quand pas de catégorie")
    void getTicketResponseById_shouldReturnNullCategorie_whenNoCategorie() {
        ticket.setCategorie(null);
        TicketResponse resNoCat = TicketResponse.builder().categorieNom(null).build();
        
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketMapper.toResponse(any(Ticket.class))).thenReturn(resNoCat);

        TicketResponse result = ticketService.getTicketResponseById(1L);

        assertThat(result.getCategorieNom()).isNull();
    }
}
