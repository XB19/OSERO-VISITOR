package com.osero.visitor.repository;

import com.osero.visitor.domain.Employee;
import com.osero.visitor.domain.EmployeeAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByProfessionalEmailIgnoreCase(String email);

    List<Employee> findByActiveTrueAndAvailability(EmployeeAvailability availability);

    List<Employee> findByActiveTrue();
}
