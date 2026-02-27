package com.fixflow.backend.service;

import com.fixflow.backend.dto.TicketRequest;
import com.fixflow.backend.dto.TicketResponse;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.repository.TicketRepository;
import com.fixflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional
    public TicketResponse createTicket(TicketRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!user.peutCreerTicket()) {
            throw new RuntimeException("Limite de tickets atteinte. Veuillez vous abonner pour en créer plus.");
        }

        Ticket ticket = new Ticket(request.getTitre(), request.getDescription(), user);
        ticket.setPriorite(request.getPriorite());
        ticket.setCategorie(request.getCategorie());
        
        Ticket savedTicket = ticketRepository.save(ticket);
        user.incrementerNombreTickets();
        userRepository.save(user);

        return mapToResponse(savedTicket);
    }

    public List<TicketResponse> getMyTickets() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return ticketRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse assignTicket(Long ticketId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User agent = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent non trouvé"));

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        ticket.attribuerAgent(agent);
        return mapToResponse(ticketRepository.save(ticket));
    }

    @Transactional
    public TicketResponse updateStatus(Long ticketId, StatutTicket statut) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        ticket.setStatut(statut);
        if (statut == StatutTicket.RESOLU) {
            ticket.resoudre();
        } else if (statut == StatutTicket.ARCHIVE) {
            ticket.archiver();
        }
        
        return mapToResponse(ticketRepository.save(ticket));
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .titre(ticket.getTitre())
                .description(ticket.getDescription())
                .statut(ticket.getStatut())
                .priorite(ticket.getPriorite())
                .categorie(ticket.getCategorie())
                .cheminFichier(ticket.getCheminFichier())
                .dateCreation(ticket.getDateCreation())
                .userNom(ticket.getUser().getNom())
                .agentNom(ticket.getAgent() != null ? ticket.getAgent().getNom() : null)
                .build();
    }
}
