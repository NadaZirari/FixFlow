package com.fixflow.backend.repository;

import com.fixflow.backend.entity.Notification;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByDestinataire(User destinataire);
    
    List<Notification> findByDestinataireAndEstLue(User destinataire, Boolean estLue);
    
    List<Notification> findByType(TypeNotification type);
    
    List<Notification> findByTicketId(Long ticketId);
    
    @Query("SELECT n FROM Notification n WHERE n.destinataire.id = :userId AND n.estLue = false ORDER BY n.dateEnvoi DESC")
    List<Notification> findUnreadNotificationsByUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.destinataire.id = :userId AND n.estLue = false")
    long countUnreadNotificationsByUser(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.destinataire.id = :userId ORDER BY n.dateEnvoi DESC")
    List<Notification> findAllNotificationsByUser(@Param("userId") Long userId);
}
