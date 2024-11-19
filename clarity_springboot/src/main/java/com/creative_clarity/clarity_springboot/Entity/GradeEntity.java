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
	
	private Float score; // Changed from float to Float
	private Float total_points; // Changed from float to Float
	private String assessment_type;
	private Date dateRecorded; 
	
	@ManyToOne
	@JoinColumn(name = "course")
	private CourseEntity course;
	
	public GradeEntity() {
		
	}

	public GradeEntity(Float score, Float total_points, Date dateRecorded, String assessment_type) {
		super();
		this.score = score;
		this.total_points = total_points;
		this.dateRecorded = dateRecorded; 
		this.assessment_type = assessment_type;
	}

	public int getGradeId() {
		return gradeId;
	}

	public Float getScore() {
		return score;
	}

	public void setScore(Float score) {
		this.score = score;
	}

	public Float getTotal_points() {
		return total_points;
	}

	public void setTotal_points(Float total_points) {
		this.total_points = total_points;
	}

	public Date getDateRecorded() { 
		return dateRecorded;
	}

	public void setDateRecorded(Date dateRecorded) { 
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