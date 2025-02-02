package com.inn.healthcare.POJO;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

@NamedQuery(name = "Appointment.getAllAppointments", query = "select a from Appointment a")
@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "appointment")

public class Appointment implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "date")
    private String date;

    @Column(name = "session")
    private String session;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "appointment_number")
    private Integer appointmentNo;
}
