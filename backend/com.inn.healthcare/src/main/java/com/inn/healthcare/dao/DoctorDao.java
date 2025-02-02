package com.inn.healthcare.dao;

import com.inn.healthcare.POJO.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorDao extends JpaRepository<Doctor,Integer> {

    List<Doctor> getAllDoctors();
}
