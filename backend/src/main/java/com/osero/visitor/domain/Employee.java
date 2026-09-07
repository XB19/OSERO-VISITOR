package com.osero.visitor.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 80)
    private String lastName;

    @Column(name = "job_title", length = 120)
    private String jobTitle;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "professional_phone", length = 30)
    private String professionalPhone;

    @Column(name = "professional_email", nullable = false, unique = true, length = 160)
    private String professionalEmail;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmployeeRole role = EmployeeRole.EMPLOYEE;

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;

    @ManyToOne
    @JoinColumn(name = "floor_id")
    private Floor floor;

    @ManyToOne
    @JoinColumn(name = "office_id")
    private Office office;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EmployeeAvailability availability = EmployeeAvailability.DISPONIBLE;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    /** Ex: "Batiment A — R+2 — Bureau 204" */
    public String getLocationLabel() {
        StringBuilder sb = new StringBuilder();
        if (building != null) sb.append(building.getName());
        if (floor != null) sb.append(sb.isEmpty() ? "" : " — ").append(floor.getLabel());
        if (office != null) sb.append(sb.isEmpty() ? "" : " — ").append(office.getLabel());
        return sb.toString();
    }
}
