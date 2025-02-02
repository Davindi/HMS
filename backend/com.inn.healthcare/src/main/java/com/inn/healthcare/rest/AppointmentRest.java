package com.inn.healthcare.rest;

import com.inn.healthcare.POJO.Appointment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/appointment")

public interface AppointmentRest {

    @PostMapping(path = "/add")
    public ResponseEntity<String> addNewAppointment(@RequestBody(required = true) Map<String, String> requestMap);

    @GetMapping(path = "/get")
    public ResponseEntity<List<Appointment>> getAllAppointments(@RequestParam(required = false) String filterValue);
}
