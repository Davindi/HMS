package com.inn.healthcare.service;

import com.inn.healthcare.POJO.Appointment;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AppointmentService {

    ResponseEntity<String> addNewAppointment(Map<String, String> requestMap);

    ResponseEntity<List<Appointment>> getAllAppointments(String filterValue);
}
