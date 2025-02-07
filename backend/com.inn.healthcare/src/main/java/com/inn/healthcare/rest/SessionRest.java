package com.inn.healthcare.rest;

import com.inn.healthcare.POJO.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/session")
public interface SessionRest {

    @PostMapping(path = "/add")
    ResponseEntity<String> addNewSession(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/get")
    ResponseEntity<List<Session>> getAllSessions(@RequestParam(required = false) String doctorName);

    // Update session status (e.g., Active / Inactive)
    @PutMapping(path = "/update-status/{sessionId}")
    ResponseEntity<String> updateSessionStatus(@PathVariable("sessionId") Integer sessionId, @RequestBody Map<String, String> statusMap);

}

