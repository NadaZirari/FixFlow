package com.fixflow.backend.service;

import com.fixflow.backend.dto.CommentRequest;
import com.fixflow.backend.dto.CommentResponse;
import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;

import com.fixflow.backend.repository.CommentaireRepository;
import com.fixflow.backend.service.interfaces.ICommentaireService;
import com.fixflow.backend.mapper.CommentMapper;
import com.fixflow.backend.exception.ResourceNotFoundException;
import com.fixflow.backend.exception.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class  CommentaireService  implements ICommentaireService {
    
    private final CommentaireRepository commentaireRepository;
    private final TicketService ticketService;
    private final UserService userService;
    private final CommentMapper commentMapper;
    
    public CommentaireService(CommentaireRepository commentaireRepository, 
                             TicketService ticketService, 
                             UserService userService,
                             CommentMapper commentMapper) {
        this.commentaireRepository = commentaireRepository;
        this.ticketService = ticketService;
        this.userService = userService;
        this.commentMapper = commentMapper;
    }
    
    public List<CommentResponse> findAll() {
        return commentaireRepository.findAll().stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public CommentResponse findResponseById(Long id) {
        return commentMapper.toResponse(findById(id));
    }

    public Commentaire findById(Long id) {
        return commentaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire", id));
    }
    
    public CommentResponse create(CommentRequest request, Long ticketId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User auteur = userService.findByEmail(email);
        Ticket ticket = ticketService.findById(ticketId);
        
        // Vérification des droits : Seul l'auteur du ticket ou l'ADMIN peut commenter
        boolean estAuteur = ticket.getUser().getId().equals(auteur.getId());
        boolean estAdmin = auteur.getRole().getNom().equals("ADMIN");

        if (!estAuteur && !estAdmin) {
            throw new AccessDeniedException("Seul l'auteur du ticket ou un administrateur peut ajouter un commentaire.");
        }
        
        Commentaire commentaire = commentMapper.toEntity(request);

        commentaire.setTicket(ticket);
        commentaire.setAuteur(auteur);
        
        return commentMapper.toResponse(commentaireRepository.save(commentaire));
    }
    
    public CommentResponse update(Long id, CommentRequest request) {
        Commentaire commentaire = findById(id);
        commentaire.setContenu(request.getContenu());

        return commentMapper.toResponse(commentaireRepository.save(commentaire));
    }
    
    public void delete(Long id) {
        Commentaire commentaire = findById(id);
        commentaireRepository.delete(commentaire);
    }
    
    public List<CommentResponse> findByTicket(Long ticketId) {
        Ticket ticket = ticketService.findById(ticketId);
        return commentaireRepository.findByTicket(ticket).stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }
    

    


    public long countByTicket(Long ticketId) {
        return commentaireRepository.countByTicket(ticketId);
    }
}
