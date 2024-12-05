package com.creative_clarity.clarity_springboot.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.*;
@Entity
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int notificationId;

    private String notificationMessage;
    private Date notificationDate;
    private boolean isRead;

    public NotificationEntity() {
    }

    public NotificationEntity(String notificationMessage, Date notificationDate, boolean isRead) {
        this.notificationMessage = notificationMessage;
        this.notificationDate = notificationDate;
        this.isRead = isRead;
    }
    
    public int getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
    }

    public String getNotificationMessage() {
        return notificationMessage;
    }

    public void setNotificationMessage(String notificationMessage) {
        this.notificationMessage = notificationMessage;
    }

    public Date getNotificationDate() {
        return notificationDate;
    }

    public void setNotificationDate(Date notificationDate) {
        this.notificationDate = notificationDate;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}
