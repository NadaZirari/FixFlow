package com.fixflow.backend.service;

import com.fixflow.backend.entity.Notification;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeNotification;
import com.fixflow.backend.repository.NotificationRepository;
import com.fixflow.backend.repository.TicketRepository;
import com.fixflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    
    public NotificationService(NotificationRepository notificationRepository, 
                             UserRepository userRepository, 
                             TicketRepository ticketRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }
    
    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }
    
    public Notification findById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec l'ID: " + id));
    }
    
    public Notification create(Notification notification) {
        User destinataire = userRepository.findById(notification.getDestinataire().getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        notification.setDestinataire(destinataire);
        
        if (notification.getTicket() != null) {
            Ticket ticket = ticketRepository.findById(notification.getTicket().getId())
                    .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
            notification.setTicket(ticket);
        }
        
        return notificationRepository.save(notification);
    }
    
    public Notification update(Long id, Notification notificationDetails) {
        Notification notification = findById(id);
        
        notification.setType(notificationDetails.getType());
        notification.setMessage(notificationDetails.getMessage());
        notification.setEstLue(notificationDetails.getEstLue());
        
        return notificationRepository.save(notification);
    }
    
    public void delete(Long id) {
        Notification notification = findById(id);
        notificationRepository.delete(notification);
    }
    
    public List<Notification> findByDestinataire(Long destinataireId) {
        User destinataire = userRepository.findById(destinataireId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return notificationRepository.findByDestinataire(destinataire);
    }
    
    public List<Notification> findUnreadNotificationsByUser(Long userId) {
        return notificationRepository.findUnreadNotificationsByUser(userId);
    }
    
    public List<Notification> findAllNotificationsByUser(Long userId) {
        return notificationRepository.findAllNotificationsByUser(userId);
    }
    
    public long countUnreadNotificationsByUser(Long userId) {
        return notificationRepository.countUnreadNotificationsByUser(userId);
    }
    
    public void markAsRead(Long notificationId) {
        Notification notification = findById(notificationId);
        notification.marquerCommeLue();
        notificationRepository.save(notification);
    }
    
    public void markAllAsReadForUser(Long userId) {
        List<Notification> unreadNotifications = findUnreadNotificationsByUser(userId);
        unreadNotifications.forEach(notification -> {
            notification.marquerCommeLue();
            notificationRepository.save(notification);
        });
    }
    
    public Notification createNotification(TypeNotification type, String message, Long destinataireId, Long ticketId) {
        User destinataire = userRepository.findById(destinataireId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        
        Notification notification = new Notification(type, message, destinataire, ticket);
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(TypeNotification type, String message, Long destinataireId) {
        User destinataire = userRepository.findById(destinataireId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Notification notification = new Notification(type, message, destinataire);
        return notificationRepository.save(notification);
    }
}
