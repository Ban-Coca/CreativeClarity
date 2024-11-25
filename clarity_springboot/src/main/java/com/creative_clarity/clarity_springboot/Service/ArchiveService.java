package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;

import javax.naming.NameNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creative_clarity.clarity_springboot.Entity.ArchiveEntity;
import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.TaskEntity;
import com.creative_clarity.clarity_springboot.Repository.ArchiveRepository;
import com.creative_clarity.clarity_springboot.Repository.CourseRepository;
import com.creative_clarity.clarity_springboot.Repository.TaskRepository;

@Service
public class ArchiveService {

	@Autowired
	ArchiveRepository arepo;

	@Autowired
	TaskRepository taskRepository;

	@Autowired
	CourseRepository courseRepository;
	
	public ArchiveService() {
		super();
	}
	
	//Create of CRUD
	public ArchiveEntity postArchiveRecord(ArchiveEntity archive) {
		return arepo.save(archive);
	}
	
	//Read of CRUD
	public List<ArchiveEntity> getAllArchives(){
		return arepo.findAll();
	}

	public List<ArchiveEntity> getArchivesByCourse(CourseEntity course) {
		return arepo.findByCourse(course);
	}
	
	//Update of CRUD
	@SuppressWarnings("finally")
	public ArchiveEntity putArchiveDetails (int archiveId, ArchiveEntity newArchiveDetails) {
		ArchiveEntity archive = new ArchiveEntity();
		
		try {
			archive = arepo.findById(archiveId).get();
			
			archive.setTitle(newArchiveDetails.getTitle());
			archive.setDescription(newArchiveDetails.getDescription());
			archive.setType(newArchiveDetails.getType());
			archive.setArchive_date(newArchiveDetails.getArchive_date());
			archive.setTags(newArchiveDetails.getTags());
		}catch(NoSuchElementException nex){
			throw new NameNotFoundException("Archive "+ archiveId +"not found");
		}finally {
			return arepo.save(archive);
		}
	}
	
	//Delete of CRUD
	public void deleteArchive(int archiveId) {
		// Fetch the archive
		ArchiveEntity archive = arepo.findById(archiveId)
								.orElseThrow(() -> new IllegalArgumentException("Archive not found"));
		
		String archiveType = archive.getType();
		
		if ("Task".equals(archiveType)) {
			// Handle the Task unarchive logic
			TaskEntity task = archive.getTask();
			if (task != null) {
				task.setArchive(null);
				task.setIsArchived(false);
				taskRepository.save(task); // Save the task to persist changes
			}
		}
		else if("Courses".equals(archiveType)){
			CourseEntity course = archive.getCourse();
			if(course != null) {
				course.setArchive(null);
				course.setIsArchived(false);
				courseRepository.save(course); // Save the course to persist changes
			}
		}
	
		// Delete the archive
		arepo.delete(archive);
	}

	// Unarchive Task Function
    public String unarchive(int archiveId) {
		String msg = "";
		
		// Find the ArchiveEntity by its ID
		if (arepo.findById(archiveId).isPresent()) {
			ArchiveEntity archive = arepo.findById(archiveId).get();
			
			// Check the type of the archive (Task or Course)
			String archiveType = archive.getType();  // Assuming 'getType()' returns the type (Task or Course)
			
			if ("Task".equals(archiveType)) {
				// Handle the Task unarchive logic
				TaskEntity task = archive.getTask();
				
				// Check if the task is present and set its 'isArchived' status to false
				if (task != null) {
					task.setArchive(null);
					task.setIsArchived(false);
					taskRepository.save(task);  // Save the updated task
					arepo.delete(archive);  // Delete the archive entry
					msg = "Task successfully unarchived!";
				} else {
					msg = "No task associated with this archive!";
				}
			} else if ("Course".equals(archiveType)) {
				// Handle the Course unarchive logic
				CourseEntity course = archive.getCourse(); // Assuming getCourse() returns the associated CourseEntity
				
				// Check if the course is present and set its 'isArchived' status to false
				if (course != null) {
					course.setArchive(null);  // Clear the reference to the archive entity
					course.setIsArchived(false);
					courseRepository.save(course);  // Save the updated course
					arepo.delete(archive);  // Delete the archive entry
					msg = "Course successfully unarchived!";
				} else {
					msg = "No course associated with this archive!";
				}
			} else {
				msg = "Unknown archive type!";
			}
			
		} else {
			msg = "Archive ID " + archiveId + " NOT FOUND!";
		}
		
		return msg;
	}
}
