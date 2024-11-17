package com.creative_clarity.clarity_springboot.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.creative_clarity.clarity_springboot.Entity.ArchiveEntity;
import com.creative_clarity.clarity_springboot.Service.ArchiveService;

@CrossOrigin(origins = "http://localhost:5173") // Allow your React app's origin
@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/archive")
public class ArchiveController {
	@Autowired
	ArchiveService aserv;
	
	@GetMapping("/print")
	public String print() {
		return "Hello, Archive";
	}
	
	//Create of CRUD
	@PostMapping("/postarchiverecord")
	public ArchiveEntity postArchiveRecord(@RequestBody ArchiveEntity archive) {
		return aserv.postArchiveRecord(archive);
	}

	//Read of CRUD
	@GetMapping("/getallarchives")
	public List<ArchiveEntity> getAllArchive(){
		return aserv.getAllArchives();
	}
		
	//Update of CRUD
	@PutMapping("/putarchivedetails/{archiveId}")
	public ArchiveEntity putArchiveDetails(@PathVariable int archiveId, @RequestBody ArchiveEntity newArchiveDetails) {
		return aserv.putArchiveDetails(archiveId, newArchiveDetails);
	}
		
	//Delete of CRUD
	@DeleteMapping("/deletearchivedetails/{archiveId}")
	public String deleteArchive(@PathVariable int archiveId) {
		return aserv.deleteArchive(archiveId);
	}
}
