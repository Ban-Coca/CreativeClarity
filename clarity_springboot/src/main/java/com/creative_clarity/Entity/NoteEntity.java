package com.creative_clarity.Entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class NoteEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int noteId;
	
	private String title;
	private String content;
	private Date created_at;
	
	public NoteEntity() {
		
	}

	public NoteEntity(String title, String content, Date created_at) {
		super();
		this.title = title;
		this.content = content;
		this.created_at = created_at;
	}

	public int getNoteId() {
		return noteId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getCreated_at() {
		return created_at;
	}

	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}
	
}