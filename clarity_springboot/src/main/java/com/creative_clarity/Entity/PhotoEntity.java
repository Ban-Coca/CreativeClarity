package com.creative_clarity.Entity;

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
	
	private String file_path;
	private Date upload_at;
	
	public PhotoEntity() {
		
	}

	public PhotoEntity(String file_path, Date upload_at) {
		super();
		this.file_path = file_path;
		this.upload_at = upload_at;
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

	public Date getUpload_at() {
		return upload_at;
	}

	public void setUpload_at(Date upload_at) {
		this.upload_at = upload_at;
	}
	
	
}
