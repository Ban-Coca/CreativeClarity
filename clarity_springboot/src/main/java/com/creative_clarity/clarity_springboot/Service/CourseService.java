package com.creative_clarity.clarity_springboot.Service;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.creative_clarity.clarity_springboot.Entity.ArchiveEntity;
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Repository.ArchiveRepository;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;

@CrossOrigin(origins = "http://localhost:5173")
@Service
public class CourseService {

	@Autowired
	CourseRepository crepo;
	
	@Autowired
	ArchiveRepository archiveRepository;

	public CourseService() {
		super();
	}
	
	//Create of CRUD
	public CourseEntity postCourseRecord(CourseEntity course) {
		return crepo.save(course);
	}
	
	//Read of CRUD
	public List<CourseEntity> getAllCourses(){
		List<CourseEntity> courses = crepo.findAll();
		return courses.stream().map(course -> {
			course.getGrades().forEach(grade -> grade.setCourse(null));
			return course;
		}).collect(Collectors.toList());
	}

	//Read of CRUD
	public Optional<CourseEntity> getCourseById(int courseId){
		return crepo.findById(courseId);
	}
	
	//Update of CRUD
	public CourseEntity putCourseDetails (int courseId, CourseEntity newCourseDetails) {
		CourseEntity course = crepo.findById(courseId).orElseThrow(() -> new NoSuchElementException("Course " + courseId + " not found"));
		
		course.setCourseName(newCourseDetails.getCourseName());
		course.setCode(newCourseDetails.getCode());
		course.setSemester(newCourseDetails.getSemester());
		course.setAcademicYear(newCourseDetails.getAcademicYear());
		course.setCreated_at(newCourseDetails.getCreated_at());
		
		return crepo.save(course);
	}
	
	//Delete of CRUD
	public String deleteCourse(int courseId) {
		String msg = "";
		
		if(crepo.findById(courseId).isPresent()) {
			crepo.deleteById(courseId);
			msg = "Course record successfully deleted!";
		}else {
			msg = "Course ID "+ courseId +" NOT FOUND!";
		}
		return msg;
	}
	
	// Method to archive a course
	public void archiveCourse(int courseId) {
		System.out.println("Course ID " + courseId);
	
		// Fetch the course to ensure it exists
		CourseEntity course = crepo.findById(courseId)
			.orElseThrow(() -> new IllegalArgumentException("Course not found"));
	
		System.out.println("Course Name: " + course.getCourseName());
		System.out.println("Course Code: " + course.getCode());
	
		// Create and populate the ArchiveEntity
		ArchiveEntity archive = new ArchiveEntity();
		archive.setTitle(course.getCourseName());
		archive.setDescription(course.getCode());  // Use code or other details for description
		archive.setType("Course");
		archive.setArchive_date(new Date());
		archive.setTags("Archived Course");
		archive.setCourse(course);
	
		// Save the archive entity first to persist it
		ArchiveEntity savedArchive = archiveRepository.save(archive);
	
		// Update the course with the archive reference
		course.setArchive(savedArchive); // Add the archive to the course's archive list
		course.setIsArchived(true); // Mark the course as archived
	
		// Save the course to update the relationship
		crepo.save(course);
	
		System.out.println("Course archived: " + course.getCourseName());
	}
}