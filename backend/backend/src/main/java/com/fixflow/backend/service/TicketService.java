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
    private final NotificationService notificationService;

    public Ticket findById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé avec l'ID: " + id));
    }

    @Transactional
    public TicketResponse createTicket(TicketRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Ticket ticket = new Ticket(request.getTitre(), request.getDescription(), user);
        ticket.setPriorite(request.getPriorite());
        ticket.setCategorie(request.getCategorie());
        
        Ticket savedTicket = ticketRepository.save(ticket);

        // Notification de création
        notificationService.createNotification(
            com.fixflow.backend.enums.TypeNotification.NOUVEAU_TICKET,
            "Votre ticket '" + ticket.getTitre() + "' a été créé avec succès.",
            user.getId(),
            savedTicket.getId()
        );

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
    public TicketResponse updateTicket(Long id, TicketRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        ticket.setTitre(request.getTitre());
        ticket.setDescription(request.getDescription());
        ticket.setPriorite(request.getPriorite());
        ticket.setCategorie(request.getCategorie());
        
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
        
        Ticket savedTicket = ticketRepository.save(ticket);

        // Notification de changement de statut
        notificationService.createNotification(
            statut == StatutTicket.RESOLU ? com.fixflow.backend.enums.TypeNotification.TICKET_RESOLU : com.fixflow.backend.enums.TypeNotification.CHANGEMENT_STATUT,
            "Le statut de votre ticket '" + ticket.getTitre() + "' est maintenant : " + statut.getDisplayName(),
            ticket.getUser().getId(),
            savedTicket.getId()
        );

        return mapToResponse(savedTicket);
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
                .build();
    }
}
