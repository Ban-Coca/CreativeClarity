package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

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

	@OneToMany(fetch = FetchType.EAGER,mappedBy = "course", cascade = CascadeType.ALL)
	private List<GradeEntity> grades;
	
	//Added Archive -Jeric
	@OneToMany(fetch = FetchType.EAGER,mappedBy = "course", cascade = CascadeType.ALL)
    private List<ArchiveEntity> archives;

	public CourseEntity() {
	}

	public CourseEntity(String courseName, String code, String semester, String academicYear, Date created_at) {
		super();
		this.courseName = courseName;
		this.code = code;
		this.semester = semester;
		this.academicYear = academicYear;
		this.created_at = created_at;
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

	public List<GradeEntity> getGrades() {
		return grades;
	}

	public void setGrades(List<GradeEntity> grades) {
		this.grades = grades;
	}
	
	//Added Archive -Jeric
	public List<ArchiveEntity> getArchives() {
        return archives;
    }

	//Added Archive -Jeric
    public void setArchives(List<ArchiveEntity> archives) {
        this.archives = archives;
    }
}