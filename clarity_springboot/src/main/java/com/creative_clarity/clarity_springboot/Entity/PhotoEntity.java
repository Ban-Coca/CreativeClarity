package com.creative_clarity.clarity_springboot.Entity;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PhotoEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int photoId;
	
	private String filename;
	private String file_path;
	private Date upload_date;
	private String caption;
	
	public PhotoEntity() {
		
	}

	public PhotoEntity(String filename, String file_path, Date upload_date, String caption) {
		super();
		this.filename = filename;
		this.file_path = file_path;
		this.upload_date = upload_date;
		this.caption = caption;
	}
	

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public int getPhotoId() {
		return photoId;
	}

	public String getFile_path() {
		return file_path;
	}

	public void setFile_path(String file_path) {
		this.file_path = file_path;
	}

	public Date getUpload_date() {
		return upload_date;
	}

	public void setUpload_date(Date upload_date) {
		this.upload_date = upload_date;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}
	
}