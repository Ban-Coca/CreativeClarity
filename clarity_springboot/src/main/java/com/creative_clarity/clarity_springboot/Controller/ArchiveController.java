package com.creative_clarity.clarity_springboot.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import com.creative_clarity.clarity_springboot.Service.ArchiveService;
import com.creative_clarity.clarity_springboot.Service.CourseService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping(method = RequestMethod.GET,path="/api/archive")
public class ArchiveController {
	
	@Autowired
	ArchiveService aserv;

	@Autowired
	CourseService courseService;

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
		
	@GetMapping("course/{courseId}")
   	public List<ArchiveEntity> getArchivesByCourse(@PathVariable int courseId) {
        CourseEntity course = courseService.getCourseById(courseId).orElse(null);
        if (course == null) {
            // Handle the case when the course is not found
            return new ArrayList<>(); // Return an empty list or handle it as needed
        }
        return aserv.getArchivesByCourse(course);
    }

	//Update of CRUD
	@PutMapping("/putarchivedetails/{archiveId}")
	public ArchiveEntity putArchiveDetails(@PathVariable int archiveId, @RequestBody ArchiveEntity newArchiveDetails) {
		return aserv.putArchiveDetails(archiveId, newArchiveDetails);
	}
		
	@DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArchive(@PathVariable int id) {
        aserv.deleteArchive(id);
        return ResponseEntity.ok("Archive deleted successfully");
    }

	// Unarchive a task from an archive record
    @PutMapping("/unarchive/{archiveId}")
    public ResponseEntity<String> unarchive(@PathVariable("archiveId") int archiveId) {
        String responseMessage = aserv.unarchive(archiveId);
        
        if (responseMessage.contains("successfully")) {
            return ResponseEntity.ok(responseMessage);  // Success
        } else {
            return ResponseEntity.status(404).body(responseMessage);  // Not Found or error
        }
    }
}
