package com.creative_clarity.clarity_springboot.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.TaskEntity;
import com.creative_clarity.clarity_springboot.Entity.NotificationEntity;
import com.creative_clarity.clarity_springboot.Repository.TaskRepository;
import com.creative_clarity.clarity_springboot.Repository.NotificationRepository;

@Service
public class NotificationService {
    @Autowired
    private TaskRepository taskRepo;
    
    @Autowired
    private NotificationRepository notificationRepo;
    
    @Scheduled(cron = "0 0 0 * * *") // Runs daily at midnight
    public void checkDueDates() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<TaskEntity> tasksDueTomorrow = taskRepo.findAll().stream()
            .filter(task -> !task.getIsCompleted())
            .filter(task -> {
                LocalDate dueDate = task.getDue_date().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
                return dueDate.equals(tomorrow);
            })
            .collect(Collectors.toList());
            
        for(TaskEntity task : tasksDueTomorrow) {
            createNotification(task);
        }
    }
    
    private void createNotification(TaskEntity task) {
        NotificationEntity notification = new NotificationEntity();
        notification.setNotificationMessage("Task '" + task.getTitle() + "' is due tomorrow!");
        notification.setNotificationDate(new Date());
        notification.setRead(false);
        //notification.setTask(task);
        notificationRepo.save(notification);
    }
    
    public List<NotificationEntity> getUnreadNotifications() {
        return notificationRepo.findAll().stream()
            .filter(notification -> !notification.isRead())
            .collect(Collectors.toList());
    }
    
    public void markAsRead(int notificationId) {
        NotificationEntity notification = notificationRepo.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepo.save(notification);
    }
}
