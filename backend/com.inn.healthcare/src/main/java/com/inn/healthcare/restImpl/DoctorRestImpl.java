package com.inn.healthcare.restImpl;

import com.inn.healthcare.POJO.Doctor;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.rest.DoctorRest;
import com.inn.healthcare.service.DoctorService;
import com.inn.healthcare.utils.HealthcareUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class DoctorRestImpl implements DoctorRest {

    @Autowired
    DoctorService doctorService;

    @Override
    public ResponseEntity<String> addNewDoctor(Map<String, String> requestMap) {
        try{
            return doctorService.addNewDoctor(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Doctor>> getAllDoctors(String filterValue) {
        try{
            return doctorService.getAllDoctors(filterValue);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateDoctor(Map<String, String> requestMap) {
        try{
            return doctorService.updateDoctor(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteDoctor(@PathVariable("id") int id) {
        return doctorService.deleteDoctor(id);
    }

}
