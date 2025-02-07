package com.inn.healthcare.service;

import com.inn.healthcare.POJO.Doctor;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface DoctorService {

    ResponseEntity<String> addNewDoctor(Map<String,String> requestMap);

    ResponseEntity<List<Doctor>> getAllDoctors(String filterValue);

    ResponseEntity<String> updateDoctor(Map<String,String> requestMap);

    ResponseEntity<String> deleteDoctor(int id);
}
