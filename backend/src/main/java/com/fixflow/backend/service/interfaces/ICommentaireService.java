package com.fixflow.backend.service.interfaces;

import com.fixflow.backend.dto.CommentRequest;
import com.fixflow.backend.dto.CommentResponse;
import com.fixflow.backend.entity.Commentaire;

import java.util.List;

public interface ICommentaireService {
    List<CommentResponse> findAll();
    CommentResponse findResponseById(Long id);
    Commentaire findById(Long id);
    CommentResponse create(CommentRequest request, Long ticketId);
    CommentResponse update(Long id, CommentRequest request);
    void delete(Long id);
    List<CommentResponse> findByTicket(Long ticketId);
    long countByTicket(Long ticketId);
}
