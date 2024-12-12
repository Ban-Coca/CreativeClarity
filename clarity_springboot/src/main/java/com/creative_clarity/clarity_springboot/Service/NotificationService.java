package com.creative_clarity.clarity_springboot.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.creative_clarity.clarity_springboot.Entity.TaskEntity;
import com.creative_clarity.clarity_springboot.Entity.NotificationEntity;
import com.creative_clarity.clarity_springboot.Entity.ReminderEntity;
import com.creative_clarity.clarity_springboot.Repository.TaskRepository;
import com.creative_clarity.clarity_springboot.Repository.NotificationRepository;
import com.creative_clarity.clarity_springboot.Repository.ReminderRepository;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private TaskRepository taskRepo;
    
    @Autowired
    private NotificationRepository notificationRepo;
    @Autowired
    private ReminderRepository reminderRepository;

    private final List<SseEmitter> sseEmitter = new CopyOnWriteArrayList<>();

	public SseEmitter getEmitter() {
		SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        emitter.onError(throwable -> {
            emitter.complete();
            synchronized (sseEmitter) {
                sseEmitter.remove(emitter);
            }
        });

        emitter.onCompletion(() -> {
            synchronized (sseEmitter) {
                sseEmitter.remove(emitter);
            }
        });

        emitter.onTimeout(() -> {
            emitter.complete();
            synchronized (sseEmitter) {
                sseEmitter.remove(emitter);
                
            }
        });

        

        sseEmitter.add(emitter);
        
        try {
            // Send initial ping event
            emitter.send(SseEmitter.event().name("ping").data("connected"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
	}

    public void createReminder(ReminderEntity reminder) {
        System.out.println(reminder);
        reminderRepository.save(reminder);
    }

    @Scheduled(cron = "* * * * * *") // Runs every minute
    public void checkReminders() {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        List<ReminderEntity> dueReminders = reminderRepository.findByNotifiedFalseAndReminderDateTimeBefore(now);
        logger.info("Checking reminders at UTC time: {}", now);
        logger.info("Found {} due reminders", dueReminders.size());
        
        synchronized (sseEmitter){
            for (ReminderEntity reminder : dueReminders) {
                reminder.setNotified(true);
                reminderRepository.save(reminder);
    
                // try {
                //     sseEmitter.send(SseEmitter.event().name("reminder").data(reminder));
                // } catch (IOException e) {
                //     sseEmitter.completeWithError(e);
                // }
                // List<SseEmitter> emittersCopy = new ArrayList<>() ;
                for(SseEmitter emitter : sseEmitter){
                    try {
                        emitter.send(SseEmitter.event().name("reminder").data(reminder));
                    } catch (IOException | IllegalStateException e) {
                        // emitter.completeWithError(e);
                        // synchronized (sseEmitter) {
                        //     sseEmitter.remove(emitter);
                        // }
                        logger.error("Error sending reminder to client", e);
                        emitter.complete();
                        sseEmitter.remove(emitter);
                    }
                }
            }
        }
        
    }
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
