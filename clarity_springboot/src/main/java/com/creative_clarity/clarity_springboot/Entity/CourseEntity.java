package com.creative_clarity.clarity_springboot.Entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class CourseEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int courseId;
	
	private String courseName;
	private String code;
	private String semester;
	private String academicYear;
	private Date created_at;
	private boolean isArchived;
	
	@JsonManagedReference("course-grade")
	@OneToMany(fetch = FetchType.EAGER,mappedBy = "course", cascade = CascadeType.ALL)
	private List<GradeEntity> grades;
	
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "course", cascade = CascadeType.ALL)
	//@JsonManagedReference
	@Fetch(FetchMode.JOIN)
    private List<TaskEntity> tasks = new ArrayList<>();
	
	@ManyToOne
    @JoinColumn(name = "user_id")
	// @JsonBackReference
	@JsonIgnoreProperties({"courses"})
    private UserEntity user;

	public CourseEntity() {
	}

	public CourseEntity(String courseName, String code, String semester, String academicYear, Date created_at, UserEntity user) {
		super();
		this.courseName = courseName;
		this.code = code;
		this.semester = semester;
		this.academicYear = academicYear;
		this.created_at = created_at;
		this.user = user;
	}

	public int getCourseId() {
		return courseId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getSemester() {
		return semester;
	}

	public void setSemester(String semester) {
		this.semester = semester;
	}

	public String getAcademicYear() {
		return academicYear;
	}

	public void setAcademicYear(String academicYear) {
		this.academicYear = academicYear;
	}

	public Date getCreated_at() {
		return created_at;
	}

	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}

	public boolean isIsArchived() {
		return isArchived;
	}

	public void setIsArchived(boolean isArchived) {
		this.isArchived = isArchived;
	}

	public List<GradeEntity> getGrades() {
		return grades;
	}

	public void setGrades(List<GradeEntity> grades) {
		this.grades = grades;
	}
	
	public List<TaskEntity> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskEntity> tasks) {
        this.tasks = tasks;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}