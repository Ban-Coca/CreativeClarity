package com.creative_clarity.clarity_springboot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.creative_clarity.clarity_springboot.Entity.TaskEntity;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {
	
}