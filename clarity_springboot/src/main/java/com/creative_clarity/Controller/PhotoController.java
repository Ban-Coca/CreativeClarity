package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Service.PhotoService;

@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/photo")
public class PhotoController {
	
	@Autowired
	PhotoService pserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Course";
	}
	
	//Create of CRUD
	@PostMapping("/postphotorecord")
	public PhotoEntity postPhotoRecord(@RequestBody PhotoEntity photo) {
		return pserv.postPhotoRecord(photo);
	}

	//Read of CRUD
	@GetMapping("/getallphoto")
	public List<PhotoEntity> getAllPhotos(){
		return pserv.getAllPhotos();
	}
		
	//Update of CRUD
	@PutMapping("/putphotodetails")
	public PhotoEntity putPhotoDetails(@RequestParam int photoId, @RequestBody PhotoEntity newPhotoDetails) {
		return pserv.putPhotoDetails(photoId, newPhotoDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deletephotodetails/{photoId}")
	public String deletePhoto(@PathVariable int photoId) {
		return pserv.deletePhoto(photoId);
	}
}
