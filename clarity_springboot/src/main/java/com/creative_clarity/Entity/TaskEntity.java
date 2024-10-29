package com.creative_clarity.Entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TaskEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int taskId;
	
	private String title;
	private String description;
	private Date due_date;
	private boolean completed;
	
	public TaskEntity() {
		
	}

	public TaskEntity(String title, String description, Date due_date, boolean completed) {
		super();
		this.title = title;
		this.description = description;
		this.due_date = due_date;
		this.completed = completed;
	}

	public int getTaskId() {
		return taskId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDue_date() {
		return due_date;
	}

	public void setDue_date(Date due_date) {
		this.due_date = due_date;
	}

	public boolean getIsCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}
	
	
}
