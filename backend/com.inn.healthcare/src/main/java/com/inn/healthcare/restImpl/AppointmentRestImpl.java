package com.inn.healthcare.restImpl;
import com.inn.healthcare.POJO.Appointment;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.rest.AppointmentRest;
import com.inn.healthcare.service.AppointmentService;
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
public class AppointmentRestImpl implements AppointmentRest{

    @Autowired
    AppointmentService appointmentService;

    @Override
    public ResponseEntity<String> addNewAppointment(Map<String, String> requestMap) {
        try {
            return appointmentService.addNewAppointment(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Appointment>> getAllAppointments(String filterValue) {
        try {
            return appointmentService.getAllAppointments(filterValue);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
