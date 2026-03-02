package com.fixflow.backend.controller;

import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.service.CommentaireService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/commentaires")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentaireController {
    
    private final CommentaireService commentaireService;
    
    public CommentaireController(CommentaireService commentaireService) {
        this.commentaireService = commentaireService;
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT')")
    public ResponseEntity<List<Commentaire>> getAllCommentaires() {
        List<Commentaire> commentaires = commentaireService.findAll();
        return ResponseEntity.ok(commentaires);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT')")
    public ResponseEntity<Commentaire> getCommentaireById(@PathVariable Long id) {
        Commentaire commentaire = commentaireService.findById(id);
        return ResponseEntity.ok(commentaire);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'SUPPORT', 'ADMIN')")
    public ResponseEntity<Commentaire> createCommentaire(@Valid @RequestBody Commentaire commentaire) {
        Commentaire createdCommentaire = commentaireService.create(commentaire);
        return ResponseEntity.ok(createdCommentaire);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('SUPPORT') and @commentaireService.findById(#id).auteur.email == authentication.principal.username) or (hasRole('USER') and @commentaireService.findById(#id).auteur.email == authentication.principal.username)")
    public ResponseEntity<Commentaire> updateCommentaire(@PathVariable Long id, @Valid @RequestBody Commentaire commentaireDetails) {
        Commentaire updatedCommentaire = commentaireService.update(id, commentaireDetails);
        return ResponseEntity.ok(updatedCommentaire);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('SUPPORT') and @commentaireService.findById(#id).auteur.email == authentication.principal.username) or (hasRole('USER') and @commentaireService.findById(#id).auteur.email == authentication.principal.username)")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT') or @ticketService.findById(#ticketId).user.email == authentication.principal.username")
    public ResponseEntity<List<Commentaire>> getCommentairesByTicket(@PathVariable Long ticketId) {
        List<Commentaire> commentaires = commentaireService.findByTicket(ticketId);
        return ResponseEntity.ok(commentaires);
    }
    
    @GetMapping("/ticket/{ticketId}/public")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT') or @ticketService.findById(#ticketId).user.email == authentication.principal.username")
    public ResponseEntity<List<Commentaire>> getPublicCommentairesByTicket(@PathVariable Long ticketId) {
        List<Commentaire> commentaires = commentaireService.findPublicCommentsByTicket(ticketId);
        return ResponseEntity.ok(commentaires);
    }
    
    @GetMapping("/ticket/{ticketId}/internal")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT')")
    public ResponseEntity<List<Commentaire>> getInternalCommentairesByTicket(@PathVariable Long ticketId) {
        List<Commentaire> commentaires = commentaireService.findInternalCommentsByTicket(ticketId);
        return ResponseEntity.ok(commentaires);
    }
    
    @PostMapping("/ticket/{ticketId}/public")
    @PreAuthorize("hasAnyRole('USER', 'SUPPORT', 'ADMIN')")
    public ResponseEntity<Commentaire> addPublicComment(@PathVariable Long ticketId, @RequestBody String contenu) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Long auteurId = commentaireService.findByAuteurEmail(email).getId();
        
        Commentaire commentaire = commentaireService.addPublicComment(contenu, ticketId, auteurId);
        return ResponseEntity.ok(commentaire);
    }
    
    @PostMapping("/ticket/{ticketId}/internal")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT')")
    public ResponseEntity<Commentaire> addInternalComment(@PathVariable Long ticketId, @RequestBody String contenu) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Long auteurId = commentaireService.findByAuteurEmail(email).getId();
        
        Commentaire commentaire = commentaireService.addInternalComment(contenu, ticketId, auteurId);
        return ResponseEntity.ok(commentaire);
    }
    
    @GetMapping("/ticket/{ticketId}/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPPORT') or @ticketService.findById(#ticketId).user.email == authentication.principal.username")
    public ResponseEntity<Long> countCommentairesByTicket(@PathVariable Long ticketId) {
        long count = commentaireService.countByTicket(ticketId);
        return ResponseEntity.ok(count);
    }
}
