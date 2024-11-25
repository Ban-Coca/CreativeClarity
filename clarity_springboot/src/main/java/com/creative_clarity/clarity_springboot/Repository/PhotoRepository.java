package com.creative_clarity.clarity_springboot.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creative_clarity.clarity_springboot.Entity.CourseEntity;
import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;

public interface PhotoRepository extends JpaRepository<PhotoEntity, Integer> {
    List<PhotoEntity> findByCourse(CourseEntity course);
}
