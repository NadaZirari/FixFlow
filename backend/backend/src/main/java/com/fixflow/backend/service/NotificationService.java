package com.fixflow.backend.service;

import com.fixflow.backend.entity.Notification;
import com.fixflow.backend.entity.Ticket;
import com.fixflow.backend.entity.User;
import com.fixflow.backend.enums.TypeNotification;
import com.fixflow.backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final TicketService ticketService;
    
    public NotificationService(NotificationRepository notificationRepository, 
                             UserService userService, 
                             TicketService ticketService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
        this.ticketService = ticketService;
    }
    
    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }
    
    public Notification findById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec l'ID: " + id));
    }
    
    public Notification create(Notification notification) {
        User destinataire = userService.findById(notification.getDestinataire().getId());
        
        notification.setDestinataire(destinataire);
        
        if (notification.getTicket() != null) {
            Ticket ticket = ticketService.findById(notification.getTicket().getId());
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
        User destinataire = userService.findById(destinataireId);
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
        User destinataire = userService.findById(destinataireId);
        Ticket ticket = ticketService.findById(ticketId);
        
        Notification notification = new Notification(type, message, destinataire, ticket);
        return notificationRepository.save(notification);
    }
    
    public Notification createNotification(TypeNotification type, String message, Long destinataireId) {
        User destinataire = userService.findById(destinataireId);
        
        Notification notification = new Notification(type, message, destinataire);
        return notificationRepository.save(notification);
    }
}
