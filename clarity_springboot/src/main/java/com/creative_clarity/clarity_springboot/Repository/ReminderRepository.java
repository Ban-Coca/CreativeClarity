package com.creative_clarity.clarity_springboot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.creative_clarity.clarity_springboot.Entity.ReminderEntity;

import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<ReminderEntity, Long> {
    List<ReminderEntity> findByNotifiedFalseAndReminderDateTimeBefore(LocalDateTime dateTime);
}
