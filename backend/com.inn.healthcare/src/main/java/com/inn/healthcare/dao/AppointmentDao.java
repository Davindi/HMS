package com.inn.healthcare.dao;

import com.inn.healthcare.POJO.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentDao extends JpaRepository<Appointment, Integer>{

    // Custom query method to fetch all appointments
    List<Appointment> findAll();

    // Example of a custom query method: find appointments by doctor name
    List<Appointment> findByDoctorName(String doctorName);

    List<Appointment> findByUserEmail(String userEmail);


    @Query("SELECT MAX(a.appointmentNo) FROM Appointment a WHERE a.doctorName = :doctorName AND a.session = :session AND a.date = :date")
    Integer findMaxAppointmentNoByDoctorSessionAndDate(
            @Param("doctorName") String doctorName,
            @Param("session") String session,
            @Param("date") String date
    );
}
