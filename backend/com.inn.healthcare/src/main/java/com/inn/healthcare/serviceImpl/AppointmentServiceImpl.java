package com.inn.healthcare.serviceImpl;

import com.google.common.base.Strings;
import com.inn.healthcare.JWT.Jwtfilter;
import com.inn.healthcare.POJO.Appointment;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.dao.AppointmentDao;
import com.inn.healthcare.service.AppointmentService;
import com.inn.healthcare.utils.HealthcareUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentServiceImpl implements AppointmentService{

    @Autowired
    AppointmentDao appointmentDao;

    @Autowired
    Jwtfilter jwtfilter;

    @Override
    public ResponseEntity<String> addNewAppointment(Map<String, String> requestMap) {
        try {
            if (jwtfilter.isUser()) {
                if (validateAppointmentMap(requestMap, false)) {
                    String doctorName = requestMap.get("doctorName");
                    String session = requestMap.get("session");
                    String date = requestMap.get("date");

                    // Fetch the maximum appointment number for the given doctor and session
                    Integer maxAppointmentNo = appointmentDao.findMaxAppointmentNoByDoctorSessionAndDate(doctorName, session, date);

                    // Increment or initialize appointment number
                    int newAppointmentNo = (maxAppointmentNo != null ? maxAppointmentNo : 0) + 1;
                    requestMap.put("appointmentNo", String.valueOf(newAppointmentNo)); // Add to request map for validation

                    Appointment appointment = getAppointmentFromMap(requestMap, false);
                    appointment.setAppointmentNo(newAppointmentNo); // Set the calculated appointment number

                    appointmentDao.save(appointment);
                    return HealthcareUtils.getResponseEntity("Appointment added successfully with Appointment No: " + newAppointmentNo, HttpStatus.OK);
                }
            } else {
                return HealthcareUtils.getResponseEntity(HealthcareConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @Override
    public ResponseEntity<List<Appointment>> getAllAppointments(String filterValue) {
        try {
            if (jwtfilter.isAdmin()) {
                // If admin, return all appointments
                return new ResponseEntity<>(appointmentDao.findAll(), HttpStatus.OK);
            } else if (jwtfilter.isUser()) {
                // If a regular user, fetch appointments by the user's email
                String userEmail = jwtfilter.getCurrentUserEmail();
                if (!Strings.isNullOrEmpty(userEmail)) {
                    List<Appointment> userAppointments = appointmentDao.findByUserEmail(userEmail);
                    return new ResponseEntity<>(userAppointments, HttpStatus.OK);
                } else {
                    // Return empty list for unexpected missing email
                    return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                // Unauthorized access
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    private boolean validateAppointmentMap(Map<String, String> requestMap, boolean validateId) {
        if (requestMap.containsKey("doctorName") && requestMap.containsKey("userEmail")
                && requestMap.containsKey("date") && requestMap.containsKey("session") ) {
            if (validateId && !requestMap.containsKey("id")) {
                return false;
            }
            return true;
        }
        return false;
    }

    private Appointment getAppointmentFromMap(Map<String, String> requestMap, boolean isUpdate) {
        Appointment appointment = new Appointment();
        if (isUpdate) {
            appointment.setId(Integer.parseInt(requestMap.get("id")));
        }
        appointment.setDoctorName(requestMap.get("doctorName"));
        appointment.setUserEmail(requestMap.get("userEmail"));
        appointment.setDate(requestMap.get("date"));
        appointment.setSession(requestMap.get("session"));
        if (requestMap.containsKey("appointmentNo")) {
            appointment.setAppointmentNo(Integer.parseInt(requestMap.get("appointmentNo")));
        }
        return appointment;
    }
}
