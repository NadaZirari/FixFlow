package com.fixflow.backend.repository;

import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.StatutTicket;
import com.fixflow.backend.enums.PrioriteTicket;
import com.fixflow.backend.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    List<Ticket> findByUser(User user);
    org.springframework.data.domain.Page<Ticket> findByUser(User user, org.springframework.data.domain.Pageable pageable);
    List<Ticket> findByStatut(StatutTicket statut);

    
    List<Ticket> findByPriorite(PrioriteTicket priorite);
    
    List<Ticket> findByCategorie(Categorie categorie);
    
    List<Ticket> findByStatutNot(StatutTicket statut);
    
    @Query("SELECT t FROM Ticket t WHERE t.user.id = :userId AND t.statut != 'ARCHIVE'")
    List<Ticket> findActiveTicketsByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.user.id = :userId AND t.statut != 'ARCHIVE'")
    long countActiveTicketsByUser(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Ticket t WHERE t.dateCreation BETWEEN :startDate AND :endDate")
    List<Ticket> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Ticket t WHERE t.titre LIKE %:keyword% OR t.description LIKE %:keyword%")
    List<Ticket> findByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.statut = :statut")
    long countByStatut(@Param("statut") StatutTicket statut);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priorite = :priorite")
    long countByPriorite(@Param("priorite") PrioriteTicket priorite);
}
