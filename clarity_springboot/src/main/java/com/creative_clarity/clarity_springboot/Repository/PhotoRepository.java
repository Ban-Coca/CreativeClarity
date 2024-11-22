package com.creative_clarity.clarity_springboot.Repository;

import com.creative_clarity.clarity_springboot.Entity.PhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<PhotoEntity, Long> {
}
