package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Repository.PhotoRepository;

@Service
public class PhotoService {
	
	@Autowired
	PhotoRepository prepo;
	
	public PhotoService() {
		super();
	}
	
	//Create of CRUD
	public PhotoEntity postPhotoRecord(PhotoEntity photo) {
		return prepo.save(photo);
	}
	
	//Read of CRUD
	public List<PhotoEntity> getAllPhotos(){
		return prepo.findAll();
	}
	
	//Update of CRUD
	@SuppressWarnings("finally")
	public PhotoEntity putPhotoDetails (int photoId, PhotoEntity newPhotoDetails) {
		PhotoEntity photo = new PhotoEntity();
		
		try {
			photo = prepo.findById(photoId).get();
		
			photo.setFilename(newPhotoDetails.getFilename());
			photo.setFile_path(newPhotoDetails.getFile_path());
			photo.setCaption(newPhotoDetails.getCaption());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Photo "+ photoId +"not found");
		}finally {
			return prepo.save(photo);
		}
	}
	
	//Delete of CRUD
	public String deletePhoto(int photoId) {
		String msg = "";
			
		if(prepo.findById(photoId).isPresent()) {
			prepo.deleteById(photoId);
			msg = "Photo record successfully deleted!";
		}else {
			msg = "Photo ID "+ photoId +" NOT FOUND!";
		}
		return msg;
	}
}