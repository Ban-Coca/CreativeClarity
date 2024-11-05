package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ArchiveEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int archiveId;
	private String title;
	private String description;
	private Date due_date;
	private double score;
	
	public ArchiveEntity() {
		
	}

<<<<<<< Updated upstream:clarity_springboot/src/main/java/com/creative_clarity/clarity_springboot/Entity/AssignmentEntity.java
	public AssignmentEntity(String title, String description, Date due_date, double score) {
=======
	public ArchiveEntity(String title, String description, LocalDate due_date, double score) {
>>>>>>> Stashed changes:clarity_springboot/src/main/java/com/creative_clarity/clarity_springboot/Entity/ArchiveEntity.java
		super();
		this.title = title;
		this.description = description;
		this.due_date = due_date;
		this.score = score;
	}

	public int getArchiveId() {
		return archiveId;
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

	public double getScore() {
		return score;
	}

	public void setScore(double score) {
		this.score = score;
	}
	
}
