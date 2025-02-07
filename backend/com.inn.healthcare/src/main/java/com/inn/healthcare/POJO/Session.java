package com.inn.healthcare.POJO;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

@NamedQuery(name = "Session.getAllSessions", query = "SELECT s FROM Session s")
@Data
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "session")
public class Session implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(name = "date", nullable = false)
    private String date;  // Use LocalDate if needed

    @Column(name = "session", nullable = false)
    private String session;  // Example: "Morning", "Afternoon", "Evening"

    @Column(name = "status", nullable = false)
    private String status;  // ACTIVE or CANCELLED
}
