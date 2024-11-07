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
	private Date date_received;
	
	@ManyToOne
	@JoinColumn(name = "course_id")
	private CourseEntity course;
	
	public GradeEntity() {
		
	}

	public GradeEntity(float score, float total_points, Date date_received) {
		super();
		this.score = score;
		this.total_points = total_points;
		this.date_received = date_received;
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

	public Date getDate_received() {
		return date_received;
	}

	public void setDate_received(Date date_received) {
		this.date_received = date_received;
	}
	
	public CourseEntity getCourse() {
		return course;
	}

	public void setCourse(CourseEntity course) {
		this.course = course;
	}
	
}