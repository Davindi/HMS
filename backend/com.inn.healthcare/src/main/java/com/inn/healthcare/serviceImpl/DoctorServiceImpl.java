package com.inn.healthcare.serviceImpl;

import com.google.common.base.Strings;
import com.inn.healthcare.JWT.Jwtfilter;
import com.inn.healthcare.POJO.Doctor;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.dao.DoctorDao;
import com.inn.healthcare.service.DoctorService;
import com.inn.healthcare.utils.HealthcareUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    DoctorDao doctorDao;

    @Autowired
    Jwtfilter jwtfilter;

    @Override
    public ResponseEntity<String> addNewDoctor(Map<String, String> requestMap) {
        try{
            if(jwtfilter.isAdmin()){
                if(validateDoctorMap(requestMap, false)){
                    doctorDao.save(getDoctorFromMap(requestMap, false));
                    return HealthcareUtils.getResponseEntity("Doctor Added Successfully", HttpStatus.OK);
                }

            }else{
                return HealthcareUtils.getResponseEntity(HealthcareConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    private boolean validateDoctorMap(Map<String, String> requestMap, boolean validateID) {
        if(requestMap.containsKey("name") && requestMap.containsKey("contactNumber")
                && requestMap.containsKey("email") && requestMap.containsKey("specialization") && requestMap.containsKey("hospital")){
            if(requestMap.containsKey("id")&& validateID){
                return true;
            }else if(!validateID){
                return true;
            }
        }
        return false;
    }

    private Doctor getDoctorFromMap(Map<String, String> requestMap, Boolean isAdd){
        Doctor doctor = new Doctor();
        if(isAdd){
            doctor.setId(Integer.parseInt(requestMap.get("id")));
        }
        doctor.setName(requestMap.get("name"));
        doctor.setEmail(requestMap.get("email"));
        doctor.setContactNumber(requestMap.get("contactNumber"));
        doctor.setSpecialization(requestMap.get("specialization"));
        doctor.setHospital(requestMap.get("hospital"));
        return doctor;
    }

    @Override
    public ResponseEntity<List<Doctor>> getAllDoctors(String filterValue) {
        try{
            if(!Strings.isNullOrEmpty(filterValue) && filterValue.equalsIgnoreCase("true")){
                return new ResponseEntity<List<Doctor>>(doctorDao.getAllDoctors(), HttpStatus.OK);
            }
            return new ResponseEntity<>(doctorDao.findAll(), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<List<Doctor>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateDoctor(Map<String, String> requestMap) {
        try{
            if(jwtfilter.isAdmin()){
                if(validateDoctorMap(requestMap, true)){
                    Optional optional = doctorDao.findById(Integer.parseInt(requestMap.get("id")));

                    if(!optional.isEmpty()){
                        doctorDao.save(getDoctorFromMap(requestMap, true));
                        return HealthcareUtils.getResponseEntity("Doctor updated Successfully", HttpStatus.OK);
                    }else{
                        return HealthcareUtils.getResponseEntity("Doctor id does not exist", HttpStatus.OK);
                    }

                }

                return HealthcareUtils.getResponseEntity(HealthcareConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }else{
                return HealthcareUtils.getResponseEntity(HealthcareConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteDoctor(int id) {
        try {
            // Check admin authorization
            if (!jwtfilter.isAdmin()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized access");
            }

            // Check if the doctor exists
            if (doctorDao.existsById(id)) {
                doctorDao.deleteById(id); // Delete the doctor
                return ResponseEntity.ok("Doctor deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Doctor not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the doctor: " + e.getMessage());
        }
    }
}
