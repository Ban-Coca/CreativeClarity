package com.creative_clarity.clarity_springboot.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import javax.naming.NameNotFoundException;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	CourseService courseService;
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
	
	//Update of CRUD
	@Transactional
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
	@Transactional
	//Delete of CRUD
	public String deleteArchive(int archiveId) {
		String msg = "";
		ArchiveEntity archive = arepo.findById(archiveId).get();
		if(arepo.findById(archiveId).isPresent()) {
			archive.setCourse(null);
			arepo.save(archive);
			arepo.deleteById(archiveId);
			msg = "Archive record successfully deleted!";
		}else {
			msg = "Archive ID "+ archiveId +" NOT FOUND!";
		}
		return msg;
	}

	@Transactional
	public List<ArchiveEntity> getArchivesByCourseId(int courseId) {
		List<ArchiveEntity> archives = arepo.findAll().stream()
        .filter(archive -> {
            CourseEntity course = archive.getCourse();
            return course != null && course.getCourseId() == courseId;
        })
        .collect(Collectors.toList());

		// Initialize the CourseEntity to avoid lazy loading issues
		for (ArchiveEntity archive : archives) {
			Hibernate.initialize(archive.getCourse());
			Hibernate.initialize(archive.getTask());
			Hibernate.initialize(archive.getCourse().getTasks()); // Initialize tasks if needed
			Hibernate.initialize(archive.getCourse().getPhotos()); // Initialize photos if needed
			Hibernate.initialize(archive.getCourse().getGrades()); // Initialize grades if needed
		}

		return archives;
	}
	@Transactional
	public String unarchive(int archiveId) {
		String msg = "";
		
		// Find the ArchiveEntity by its ID
		if (arepo.findById(archiveId).isPresent()) {
			ArchiveEntity archive = arepo.findById(archiveId).get();
			Hibernate.initialize(archive.getTask());
        	Hibernate.initialize(archive.getCourse());
			// Check the type of the archive (Task or Course)
			String archiveType = archive.getType();  // Assuming 'getType()' returns the type (Task or Course)
			
			if ("Task".equals(archiveType)) {
				// Handle the Task unarchive logic
				
				Hibernate.initialize(archive.getTask());
        		Hibernate.initialize(archive.getCourse());
				// Check if the task is present and set its 'isArchived' status to false
				TaskEntity task = archive.getTask(); // Assuming getTasks() returns the associated TaskEntity
				if (task != null) {
					task.setIsArchived(false);
            		task.setArchive(null); // Remove the reference to the archive
            		task.setCompleted(false);
					taskRepository.save(task);  // Save the updated task
					archive.setTask(null);  // Clear the reference to the task entity
					archive.setCourse(null);
					arepo.save(archive);  // Save the updated archive
					arepo.delete(archive);  // Delete the archive entry
                    msg = "Task(s) successfully unarchived!";
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
