package com.fixflow.backend.service;

import com.fixflow.backend.dto.CommentRequest;
import com.fixflow.backend.dto.CommentResponse;
import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.repository.CommentaireRepository;
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
public class CommentService {

    private final CommentaireRepository commentaireRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse addComment(Long ticketId, CommentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User auteur = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Auteur non trouvé"));

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        Commentaire commentaire = new Commentaire();
        commentaire.setContenu(request.getContenu());
        commentaire.setType(request.getType());
        commentaire.setTicket(ticket);
        commentaire.setAuteur(auteur);

        return mapToResponse(commentaireRepository.save(commentaire));
    }

    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        return commentaireRepository.findByTicket(ticket).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse mapToResponse(Commentaire commentaire) {
        return CommentResponse.builder()
                .id(commentaire.getId())
                .contenu(commentaire.getContenu())
                .date(commentaire.getDate())
                .type(commentaire.getType())
                .auteurNom(commentaire.getAuteur().getNom())
                .build();
    }
}
