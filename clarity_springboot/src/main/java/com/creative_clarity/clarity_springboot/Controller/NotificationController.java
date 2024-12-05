package com.creative_clarity.clarity_springboot.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.creative_clarity.clarity_springboot.Entity.NotificationEntity;
import com.creative_clarity.clarity_springboot.Service.NotificationService;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/unread")
    public List<NotificationEntity> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }
    
    @PutMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable int notificationId) {
        notificationService.markAsRead(notificationId);
    }
}
