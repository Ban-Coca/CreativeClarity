package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class GradeEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int gradeId;
	
	private float score;
	private float total_points;
	private String assessment_type;
	private Date dateRecorded; // Renamed from date_received
	
	@ManyToOne
	@JoinColumn(name = "course")
	private CourseEntity course;
	
	public GradeEntity() {
		
	}

	public GradeEntity(float score, float total_points, Date dateRecorded, String assessment_type) { // Renamed from date_received
		super();
		this.score = score;
		this.total_points = total_points;
		this.dateRecorded = dateRecorded; // Renamed from date_received
		this.assessment_type = assessment_type;
	}

	public int getGradeId() {
		return gradeId;
	}

	public float getScore() {
		return score;
	}

	public void setScore(float score) {
		this.score = score;
	}

	public float getTotal_points() {
		return total_points;
	}

	public void setTotal_points(float total_points) {
		this.total_points = total_points;
	}

	public Date getDateRecorded() { // Renamed from getDate_received
		return dateRecorded;
	}

	public void setDateRecorded(Date dateRecorded) { // Renamed from setDate_received
		this.dateRecorded = dateRecorded;
	}
	
	public String getAssessment_type() {
		return assessment_type;
	}

	public void setAssessment_type(String assessment_type) {
		this.assessment_type = assessment_type;
	}

	public CourseEntity getCourse() {
		return course;
	}

	public void setCourse(CourseEntity course) {
		this.course = course;
	}
	
}