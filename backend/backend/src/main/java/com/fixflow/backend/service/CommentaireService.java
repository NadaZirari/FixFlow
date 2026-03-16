package com.fixflow.backend.service;

import com.fixflow.backend.dto.CommentRequest;
import com.fixflow.backend.dto.CommentResponse;
import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeCommentaire;
import com.fixflow.backend.repository.CommentaireRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentaireService {
    
    private final CommentaireRepository commentaireRepository;
    private final TicketService ticketService;
    private final UserService userService;
    
    public CommentaireService(CommentaireRepository commentaireRepository, 
                             TicketService ticketService, 
                             UserService userService) {
        this.commentaireRepository = commentaireRepository;
        this.ticketService = ticketService;
        this.userService = userService;
    }
    
    public List<CommentResponse> findAll() {
        return commentaireRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public CommentResponse findResponseById(Long id) {
        return mapToResponse(findById(id));
    }

    public Commentaire findById(Long id) {
        return commentaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commentaire non trouvé avec l'ID: " + id));
    }
    
    public CommentResponse create(CommentRequest request, Long ticketId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User auteur = userService.findByEmail(email);
        Ticket ticket = ticketService.findById(ticketId);
        
        // Vérification des droits : Seul l'auteur du ticket ou un ADMIN peut commenter
        boolean estAuteur = ticket.getUser().getId().equals(auteur.getId());
        boolean estAdmin = auteur.getRole() == com.fixflow.backend.enums.Role.ADMIN;

        if (!estAuteur && !estAdmin) {
            throw new RuntimeException("Accès refusé : Seul l'auteur du ticket ou un administrateur peut ajouter un commentaire.");
        }
        
        Commentaire commentaire = new Commentaire();
        commentaire.setContenu(request.getContenu());
        commentaire.setType(request.getType() != null ? request.getType() : TypeCommentaire.PUBLIC);
        commentaire.setTicket(ticket);
        commentaire.setAuteur(auteur);
        
        return mapToResponse(commentaireRepository.save(commentaire));
    }
    
    public CommentResponse update(Long id, CommentRequest request) {
        Commentaire commentaire = findById(id);
        commentaire.setContenu(request.getContenu());
        if (request.getType() != null) {
            commentaire.setType(request.getType());
        }
        return mapToResponse(commentaireRepository.save(commentaire));
    }
    
    public void delete(Long id) {
        Commentaire commentaire = findById(id);
        commentaireRepository.delete(commentaire);
    }
    
    public List<CommentResponse> findByTicket(Long ticketId) {
        Ticket ticket = ticketService.findById(ticketId);
        return commentaireRepository.findByTicket(ticket).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CommentResponse> findPublicCommentsByTicket(Long ticketId) {
        return commentaireRepository.findPublicCommentsByTicket(ticketId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<CommentResponse> findInternalCommentsByTicket(Long ticketId) {
        return commentaireRepository.findInternalCommentsByTicket(ticketId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public CommentResponse mapToResponse(Commentaire commentaire) {
        return CommentResponse.builder()
                .id(commentaire.getId())
                .contenu(commentaire.getContenu())
                .date(commentaire.getDate())
                .type(commentaire.getType())
                .auteurNom(commentaire.getAuteur().getNom())
                .build();
    }

    public long countByTicket(Long ticketId) {
        return commentaireRepository.countByTicket(ticketId);
    }
}
