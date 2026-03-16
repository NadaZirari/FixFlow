package com.fixflow.backend.controller;

import com.fixflow.backend.dto.CommentRequest;
import com.fixflow.backend.dto.CommentResponse;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentResponse>> getAllCommentaires() {
        return ResponseEntity.ok(commentaireService.findAll());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CommentResponse> getCommentaireById(@PathVariable Long id) {
        return ResponseEntity.ok(commentaireService.findResponseById(id));
    }
    
    @PostMapping("/ticket/{ticketId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long ticketId, @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentaireService.create(request, ticketId));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @commentaireService.findById(#id).auteur.email == authentication.principal.username")
    public ResponseEntity<CommentResponse> updateCommentaire(@PathVariable Long id, @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentaireService.update(id, request));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @commentaireService.findById(#id).auteur.email == authentication.principal.username")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasRole('ADMIN') or @ticketService.findById(#ticketId).user.email == authentication.principal.username")
    public ResponseEntity<List<CommentResponse>> getCommentairesByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentaireService.findByTicket(ticketId));
    }
    
    
    @GetMapping("/ticket/{ticketId}/count")
    @PreAuthorize("hasRole('ADMIN') or @ticketService.findById(#ticketId).user.email == authentication.principal.username")
    public ResponseEntity<Long> countCommentairesByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentaireService.countByTicket(ticketId));
    }
}
