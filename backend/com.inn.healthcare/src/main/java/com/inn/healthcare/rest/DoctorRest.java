package com.inn.healthcare.rest;

import com.inn.healthcare.POJO.Doctor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/doctor")

public interface DoctorRest {

    @PostMapping(path = "/add")
    public ResponseEntity<String> addNewDoctor(@RequestBody(required = true) Map<String,String> requestMap);

    @GetMapping(path = "/get")
    public ResponseEntity<List<Doctor>> getAllDoctors(@RequestParam(required = false) String filterValue);

    @PostMapping(path = "/update")
    public ResponseEntity<String> updateDoctor(@RequestBody(required = true) Map<String,String> requestMap);

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable("id") int id);
}
