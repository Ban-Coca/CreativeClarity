package com.creative_clarity.clarity_springboot.Entity;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AssignmentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int assignmentId;
	private String title;
	private String description;
	private LocalDate  due_date;
	private double score;
	
	public AssignmentEntity() {
		
	}

	public AssignmentEntity(String title, String description, LocalDate due_date, double score) {
		super();
		this.title = title;
		this.description = description;
		this.due_date = due_date;
		this.score = score;
	}

	public int getAssignmentId() {
		return assignmentId;
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

	public LocalDate getDue_date() {
		return due_date;
	}

	public void setDue_date(LocalDate due_date) {
		this.due_date = due_date;
	}

	public double getScore() {
		return score;
	}

	public void setScore(double score) {
		this.score = score;
	}
	
}
