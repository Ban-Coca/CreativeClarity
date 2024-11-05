package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class NotificationEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int notificationId;
	
	private String message;
	private Date send_time;
	private boolean is_read;
	
	public NotificationEntity() {
		
	}

	public NotificationEntity(String message, Date send_time, boolean is_read) {
		super();
		this.message = message;
		this.send_time = send_time;
		this.is_read = is_read;
	}

	public int getNotificationId() {
		return notificationId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Date getSend_time() {
		return send_time;
	}

	public void setSend_time(Date send_time) {
		this.send_time = send_time;
	}

	public boolean getIs_read() {
		return is_read;
	}

	public void setIs_read(boolean is_read) {
		this.is_read = is_read;
	}
	
	
}