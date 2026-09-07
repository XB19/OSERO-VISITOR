package com.osero.visitor.dto;

import com.osero.visitor.domain.EmployeeAvailability;
import com.osero.visitor.domain.EmployeeRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class EmployeeDtos {

    /** Utilise par la borne pour la selection de la personne a rencontrer. */
    public record EmployeeSummary(
            UUID id,
            String fullName,
            String jobTitle,
            String departmentName,
            EmployeeAvailability availability
    ) {}

    public record EmployeeDetail(
            UUID id,
            String firstName,
            String lastName,
            String jobTitle,
            UUID departmentId,
            String departmentName,
            String professionalPhone,
            String professionalEmail,
            EmployeeRole role,
            UUID buildingId,
            UUID floorId,
            UUID officeId,
            String locationLabel,
            EmployeeAvailability availability,
            boolean active
    ) {}

    public record EmployeeCreateRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            String jobTitle,
            UUID departmentId,
            String professionalPhone,
            @NotBlank @Email String professionalEmail,
            String password,
            EmployeeRole role,
            UUID buildingId,
            UUID floorId,
            UUID officeId
    ) {}

    public record EmployeeUpdateRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            String jobTitle,
            UUID departmentId,
            String professionalPhone,
            @NotBlank @Email String professionalEmail,
            EmployeeRole role,
            UUID buildingId,
            UUID floorId,
            UUID officeId,
            EmployeeAvailability availability,
            boolean active
    ) {}
}
