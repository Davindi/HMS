package com.inn.healthcare.service;

import com.inn.healthcare.POJO.Session;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface SessionService {

    ResponseEntity<String> addNewSession(Map<String, String> requestMap);

    ResponseEntity<List<Session>> getAllSessions(String doctorName);
}
