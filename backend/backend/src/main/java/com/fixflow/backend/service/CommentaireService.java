package com.fixflow.backend.service;

import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeCommentaire;
import com.fixflow.backend.repository.CommentaireRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    
    public List<Commentaire> findAll() {
        return commentaireRepository.findAll();
    }
    
    public Commentaire findById(Long id) {
        return commentaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commentaire non trouvé avec l'ID: " + id));
    }
    
    public Commentaire create(Commentaire commentaire) {
        Ticket ticket = ticketService.findById(commentaire.getTicket().getId());
        User auteur = userService.findById(commentaire.getAuteur().getId());
        
        commentaire.setTicket(ticket);
        commentaire.setAuteur(auteur);
        
        return commentaireRepository.save(commentaire);
    }
    
    public Commentaire update(Long id, Commentaire commentaireDetails) {
        Commentaire commentaire = findById(id);
        
        commentaire.setContenu(commentaireDetails.getContenu());
        commentaire.setType(commentaireDetails.getType());
        
        return commentaireRepository.save(commentaire);
    }
    
    public void delete(Long id) {
        Commentaire commentaire = findById(id);
        commentaireRepository.delete(commentaire);
    }
    
    public List<Commentaire> findByTicket(Long ticketId) {
        Ticket ticket = ticketService.findById(ticketId);
        return commentaireRepository.findByTicket(ticket);
    }
    
    public List<Commentaire> findPublicCommentsByTicket(Long ticketId) {
        return commentaireRepository.findPublicCommentsByTicket(ticketId);
    }
    
    public List<Commentaire> findInternalCommentsByTicket(Long ticketId) {
        return commentaireRepository.findInternalCommentsByTicket(ticketId);
    }
    
    public List<Commentaire> findByAuteur(Long auteurId) {
        User auteur = userService.findById(auteurId);
        return commentaireRepository.findByAuteur(auteur);
    }
    
    public Commentaire addPublicComment(String contenu, Long ticketId, Long auteurId) {
        Ticket ticket = ticketService.findById(ticketId);
        User auteur = userService.findById(auteurId);
        
        Commentaire commentaire = new Commentaire(contenu, ticket, auteur, TypeCommentaire.PUBLIC);
        return commentaireRepository.save(commentaire);
    }
    
    public Commentaire addInternalComment(String contenu, Long ticketId, Long auteurId) {
        Ticket ticket = ticketService.findById(ticketId);
        User auteur = userService.findById(auteurId);
        
        Commentaire commentaire = new Commentaire(contenu, ticket, auteur, TypeCommentaire.INTERNE);
        return commentaireRepository.save(commentaire);
    }
    
    public long countByTicket(Long ticketId) {
        return commentaireRepository.countByTicket(ticketId);
    }
}
