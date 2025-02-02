package com.inn.healthcare.serviceImpl;

import com.google.common.base.Strings;
import com.inn.healthcare.JWT.CustomerUsersDetailsService;
import com.inn.healthcare.JWT.JwtUtil;
import com.inn.healthcare.JWT.Jwtfilter;
import com.inn.healthcare.POJO.User;
import com.inn.healthcare.constents.HealthcareConstants;
import com.inn.healthcare.dao.UserDao;
import com.inn.healthcare.service.UserService;
import com.inn.healthcare.utils.EmailUtils;
import com.inn.healthcare.utils.HealthcareUtils;
import com.inn.healthcare.wrapper.UserWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    CustomerUsersDetailsService customerUsersDetailsService;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    Jwtfilter jwtfilter;

    @Autowired
    EmailUtils emailUtils;

    @Override
    public ResponseEntity<String> signUp(Map<String, String> requestMap) {

        log.info("inside signup {}", requestMap);
        try {
            if (validateSignUpMap(requestMap)) {
                User user = userDao.findByEmailId(requestMap.get("email"));
                if (Objects.isNull(user)) {
                    userDao.save(getUserFromMap(requestMap));
                    return HealthcareUtils.getResponseEntity("Successfully Registered", HttpStatus.OK);
                } else {
                    return HealthcareUtils.getResponseEntity("Email already exists", HttpStatus.BAD_REQUEST);
                }
            } else {
                return HealthcareUtils.getResponseEntity(HealthcareConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateSignUpMap(Map<String,String> requestMap){

        if(requestMap.containsKey("name") && requestMap.containsKey("contactNumber")
                && requestMap.containsKey("email") && requestMap.containsKey("password"))
        {
            return true;
        }
        return false;
    }

    private User getUserFromMap(Map<String, String> requestMap){
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setContactNumber(requestMap.get("contactNumber"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(requestMap.get("password"));
        user.setStatus("true");
        user.setRole("user");
        return user;
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside login");
        try{
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password"))
            );
            if(auth.isAuthenticated()){
                if(customerUsersDetailsService.getUserDetail().getStatus().equalsIgnoreCase("true")){
                    return new ResponseEntity<String>("{\"token\":\""+
                            jwtUtil.generateToken(customerUsersDetailsService.getUserDetail().getEmail(),
                                    customerUsersDetailsService.getUserDetail().getRole())+ "\"}",
                    HttpStatus.OK);
                } else{
                    return new ResponseEntity<String>("{\"message\":\""+"Wait for admin approval"+"\"}",
                            HttpStatus.BAD_REQUEST);
                }
            }

        }catch (Exception ex) {
            log.error("{}", ex);
        }
        return new ResponseEntity<String>("{\"message\":\""+"Bad credentials"+"\"}",
                HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<List<UserWrapper>> getAllUser() {
        try{
            if(jwtfilter.isAdmin()){
                return new ResponseEntity<>(userDao.getAllUser(), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<List<UserWrapper>>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try{
           if(jwtfilter.isAdmin()){
               Optional<User>optional = userDao.findById(Integer.parseInt(requestMap.get("id")));
               if(!optional.isEmpty()){
                   userDao.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")) );
                   sendMailToAllAdmin(requestMap.get("status"), optional.get().getEmail(), userDao.getAllAdmin());
                   return HealthcareUtils.getResponseEntity("User status updated successfully", HttpStatus.OK);
               }else{
                   return HealthcareUtils.getResponseEntity("User id does not exist", HttpStatus.OK);
               }
           }else{
               return HealthcareUtils.getResponseEntity(HealthcareConstants.UNAUTHORIZED_ACCESS , HttpStatus.UNAUTHORIZED);
           }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void sendMailToAllAdmin(String status, String user, List<String> allAdmin) {
        allAdmin.remove(jwtfilter.getCurrentUser());
        if(status !=null && status.equalsIgnoreCase("true")){
            emailUtils.sendSimpleMessage(jwtfilter.getCurrentUser(), "Account approved", "USER:-"+user+"\n is approved by \nADMIN:-" + jwtfilter.getCurrentUser(), allAdmin);
        }else{
            emailUtils.sendSimpleMessage(jwtfilter.getCurrentUser(), "Account disabled", "USER:-"+user+"\n is disabled by \nADMIN:-" + jwtfilter.getCurrentUser(), allAdmin);

        }
    }

    @Override
    public ResponseEntity<String> checkToken() {
        return HealthcareUtils.getResponseEntity("true", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try{
            User userObj = userDao.findByEmail(jwtfilter.getCurrentUser());
            if(!userObj.equals(null)){
                if(userObj.getPassword().equals(requestMap.get("oldPassword"))){
                    userObj.setPassword(requestMap.get("newPassword"));
                    userDao.save(userObj);
                    return HealthcareUtils.getResponseEntity("Password Updated Successfully", HttpStatus.OK);
                }
                return HealthcareUtils.getResponseEntity("Incorrect old password", HttpStatus.BAD_REQUEST);
            }
            return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        try{
            User user = userDao.findByEmail(requestMap.get("email"));
            if(!Objects.isNull(user) && !Strings.isNullOrEmpty(user.getEmail())){
                emailUtils.forgotMail(user.getEmail(), "Credentials by healthcare management system", user.getPassword());
            }
            return HealthcareUtils.getResponseEntity("Check your mail for credentials", HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return HealthcareUtils.getResponseEntity(HealthcareConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
