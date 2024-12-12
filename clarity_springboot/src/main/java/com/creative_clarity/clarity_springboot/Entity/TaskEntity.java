package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class TaskEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int taskId;
	
	private String title;
	private String description;
	private Date due_date;
	private boolean completed;
	private String priority;  // new field
	private boolean isArchived;  // New field to track archive status
	
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    @JsonIgnoreProperties({"tasks", "grades"}) 
	//@JsonBackReference
	private CourseEntity course;

    // @ManyToOne(fetch = FetchType.EAGER)
    // @JoinColumn(name = "archive")
	// @JsonIgnoreProperties("tasks")
    // private ArchiveEntity archive;

	@OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "archive")
    //@JsonBackReference
    @JsonIgnoreProperties("tasks")
    private ArchiveEntity archive;

	public TaskEntity() {
		
	}

	public TaskEntity(String title, String description, Date due_date, boolean completed, String priority) {
		super();
		this.title = title;
		this.description = description;
		this.due_date = due_date;
		this.completed = completed;
		this.priority = priority;
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
	
	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public boolean getIsArchived() {
        return isArchived;
    }

    public void setIsArchived(boolean isArchived) {
        this.isArchived = isArchived;
    }
	
	public CourseEntity getCourse() {
        return course;
    }

    public void setCourse(CourseEntity course) {
        this.course = course;
    }

    public ArchiveEntity getArchive() {
        return archive;
    }

    public void setArchive(ArchiveEntity archive) {
        this.archive = archive;
    }
}
