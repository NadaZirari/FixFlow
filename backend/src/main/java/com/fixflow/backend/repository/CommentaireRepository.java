package com.fixflow.backend.repository;

import com.fixflow.backend.entity.Commentaire;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    
    List<Commentaire> findByTicket(Ticket ticket);
    
    List<Commentaire> findByAuteur(User auteur);
    

    
    @Query("SELECT COUNT(c) FROM Commentaire c WHERE c.ticket.id = :ticketId")
    long countByTicket(@Param("ticketId") Long ticketId);
}
