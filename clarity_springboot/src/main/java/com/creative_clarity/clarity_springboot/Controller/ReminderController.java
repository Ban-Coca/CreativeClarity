package com.creative_clarity.clarity_springboot.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.creative_clarity.clarity_springboot.Entity.ReminderEntity;
import com.creative_clarity.clarity_springboot.Service.NotificationService;

@RestController
@RequestMapping("/api/reminder")
public class ReminderController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/reminders")
    public void createReminder(@RequestBody ReminderEntity reminder) {
        notificationService.createReminder(reminder);
    }

    @GetMapping(value="/notifications", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications() {
        return notificationService.getEmitter();
    }

    @GetMapping("/check")
    public void checkReminders() {
        notificationService.checkReminders();
    }
}
