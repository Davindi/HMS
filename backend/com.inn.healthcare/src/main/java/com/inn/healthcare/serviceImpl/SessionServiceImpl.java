package com.inn.healthcare.serviceImpl;

import com.google.common.base.Strings;
import com.inn.healthcare.JWT.Jwtfilter;
import com.inn.healthcare.POJO.Session;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.dao.SessionDao;
import com.inn.healthcare.service.SessionService;
import com.inn.healthcare.utils.HealthcareUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SessionServiceImpl implements SessionService {

    @Autowired
    SessionDao sessionDao;

    @Autowired
    Jwtfilter jwtfilter;

    @Override
    public ResponseEntity<String> addNewSession(Map<String, String> requestMap) {
        try {
            if (jwtfilter.isAdmin()) { // Only admins can add sessions
                if (validateSessionMap(requestMap, false)) {
                    Session session = getSessionFromMap(requestMap, false);
                    sessionDao.save(session);
                    return HealthcareUtils.getResponseEntity("Session added successfully!", HttpStatus.OK);
                }
                return HealthcareUtils.getResponseEntity("Invalid session data!", HttpStatus.BAD_REQUEST);
            }
            return HealthcareUtils.getResponseEntity(HealthcareConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<Session>> getAllSessions(String doctorName) {
        try {
            if (jwtfilter.isAdmin() || jwtfilter.isUser()) { // Admins & users can view sessions
                List<Session> sessions;
                if (!Strings.isNullOrEmpty(doctorName)) {
                    sessions = sessionDao.findByDoctorName(doctorName);
                } else {
                    sessions = sessionDao.findAll();
                }
                return new ResponseEntity<>(sessions, HttpStatus.OK);
            }
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    private boolean validateSessionMap(Map<String, String> requestMap, boolean validateId) {
        if (requestMap.containsKey("doctorName") && requestMap.containsKey("date")
                && requestMap.containsKey("session") && requestMap.containsKey("status")) {
            if (validateId && !requestMap.containsKey("id")) {
                return false;
            }
            return true;
        }
        return false;
    }

    private Session getSessionFromMap(Map<String, String> requestMap, boolean isUpdate) {
        Session session = new Session();
        if (isUpdate) {
            session.setId(Integer.parseInt(requestMap.get("id")));
        }
        session.setDoctorName(requestMap.get("doctorName"));
        session.setDate(requestMap.get("date"));
        session.setSession(requestMap.get("session"));
        session.setStatus(requestMap.get("status"));
        return session;
    }
}

