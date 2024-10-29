package com.creative_clarity.Entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class GradeEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int gradeId;
	
	private String gradeType;
	private float score;
	private Date date_recorded;
	
	public GradeEntity() {
		
	}

	public GradeEntity(String gradeType, float score, Date date_recorded) {
		super();
		this.gradeType = gradeType;
		this.score = score;
		this.date_recorded = date_recorded;
	}

	public int getGradeId() {
		return gradeId;
	}

	public String getGradeType() {
		return gradeType;
	}

	public void setGradeType(String gradeType) {
		this.gradeType = gradeType;
	}

	public float getScore() {
		return score;
	}

	public void setScore(float score) {
		this.score = score;
	}

	public Date getDate_recorded() {
		return date_recorded;
	}

	public void setDate_recorded(Date date_recorded) {
		this.date_recorded = date_recorded;
	}
	
	
}