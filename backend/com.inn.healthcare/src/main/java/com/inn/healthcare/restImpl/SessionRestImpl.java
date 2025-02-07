package com.inn.healthcare.restImpl;

import com.inn.healthcare.POJO.Session;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.rest.SessionRest;
import com.inn.healthcare.service.SessionService;
import com.inn.healthcare.utils.HealthcareUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class SessionRestImpl implements SessionRest {

    @Autowired
    private SessionService sessionService;

    @Override
    public ResponseEntity<String> addNewSession(Map<String, String> requestMap) {
        try {
            return sessionService.addNewSession(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Session>> getAllSessions(String doctorName) {
        try {
            return sessionService.getAllSessions(doctorName);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateSessionStatus(Integer sessionId, Map<String, String> statusMap) {
        try {
            return sessionService.updateSessionStatus(sessionId, statusMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
