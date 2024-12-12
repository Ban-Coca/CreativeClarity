package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class ArchiveEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int archiveId;
	
	private String title;
	private String description;
	private String type;
	private Date archive_date;
	private String tags;

	@JsonBackReference("course-archive")
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course")
    private CourseEntity course;

	@OneToOne(mappedBy = "archive", fetch = FetchType.LAZY)
    @JsonIgnore
    private TaskEntity task;
	
	public ArchiveEntity() {
		
	}

	public ArchiveEntity(String title, String description, String type, Date archive_date, String tags) {
		super();
		this.title = title;
		this.description = description;
		this.type = type;
		this.archive_date = archive_date;
		this.tags = tags;
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

	public String getType() {
		return type;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getArchive_date() {
		return archive_date;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setArchive_date(Date archive_date) {
		this.archive_date = archive_date;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public String getDescription() {
		return description;
	}

	public CourseEntity getCourse() {
        return course;  // Getter for the associated course
    }

	public TaskEntity getTask() {
        return task;
    }

    public void setTask(TaskEntity task) {
        this.task = task;
    }
    public void setCourse(CourseEntity course) {
        this.course = course;  // Setter for the associated course
    }
}