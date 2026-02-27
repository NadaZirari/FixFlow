package com.fixflow.backend.repository;

import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeCommentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    
    List<Commentaire> findByTicket(Ticket ticket);
    
    List<Commentaire> findByAuteur(User auteur);
    
    List<Commentaire> findByType(TypeCommentaire type);
    
    List<Commentaire> findByTicketAndType(Ticket ticket, TypeCommentaire type);
    
    @Query("SELECT c FROM Commentaire c WHERE c.ticket.id = :ticketId AND c.type = 'PUBLIC'")
    List<Commentaire> findPublicCommentsByTicket(@Param("ticketId") Long ticketId);
    
    @Query("SELECT c FROM Commentaire c WHERE c.ticket.id = :ticketId AND c.type = 'INTERNE'")
    List<Commentaire> findInternalCommentsByTicket(@Param("ticketId") Long ticketId);
    
    @Query("SELECT COUNT(c) FROM Commentaire c WHERE c.ticket.id = :ticketId")
    long countByTicket(@Param("ticketId") Long ticketId);
}
