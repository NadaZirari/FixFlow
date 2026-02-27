package com.fixflow.backend.controller;

import com.fixflow.backend.entity.Notification;
import com.fixflow.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.findAll();
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @notificationService.findById(#id).destinataire.email == authentication.principal.username")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Notification notification = notificationService.findById(id);
        return ResponseEntity.ok(notification);
    }
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == @userService.findByEmail(authentication.principal.username).id")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.findByDestinataire(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread")
    @PreAuthorize("hasRole('ADMIN') or #userId == @userService.findByEmail(authentication.principal.username).id")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.findUnreadNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/all")
    @PreAuthorize("hasRole('ADMIN') or #userId == @userService.findByEmail(authentication.principal.username).id")
    public ResponseEntity<List<Notification>> getAllNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.findAllNotificationsByUser(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/user/{userId}/unread/count")
    @PreAuthorize("hasRole('ADMIN') or #userId == @userService.findByEmail(authentication.principal.username).id")
    public ResponseEntity<Long> countUnreadNotificationsByUser(@PathVariable Long userId) {
        long count = notificationService.countUnreadNotificationsByUser(userId);
        return ResponseEntity.ok(count);
    }
    
    @PostMapping("/{id}/mark-read")
    @PreAuthorize("hasRole('ADMIN') or @notificationService.findById(#id).destinataire.email == authentication.principal.username")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/user/{userId}/mark-all-read")
    @PreAuthorize("hasRole('ADMIN') or #userId == @userService.findByEmail(authentication.principal.username).id")
    public ResponseEntity<Void> markAllAsReadForUser(@PathVariable Long userId) {
        notificationService.markAllAsReadForUser(userId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
