package com.inn.healthcare.dao;

import com.inn.healthcare.POJO.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SessionDao extends JpaRepository<Session, Integer> {

    List<Session> findAll(); // Fetch all sessions

    List<Session> findByDoctorName(String doctorName); // Fetch sessions by doctor

    List<Session> findByDoctorNameAndDate(String doctorName, String date); // Fetch by doctor & date

    List<Session> findByStatus(String status); // Fetch ACTIVE or CANCELLED sessions

    // Update session status by session ID
    @Modifying
    @Transactional
    @Query("UPDATE Session s SET s.status = :status WHERE s.id = :id")
    int updateSessionStatus(Integer id, String status); // Update status of session by session ID
}
