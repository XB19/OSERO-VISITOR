package com.osero.visitor.service;

import com.osero.visitor.domain.*;
import com.osero.visitor.dto.EmployeeDtos.*;
import com.osero.visitor.exception.ResourceNotFoundException;
import com.osero.visitor.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final BuildingRepository buildingRepository;
    private final FloorRepository floorRepository;
    private final OfficeRepository officeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository,
                            BuildingRepository buildingRepository, FloorRepository floorRepository,
                            OfficeRepository officeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.buildingRepository = buildingRepository;
        this.floorRepository = floorRepository;
        this.officeRepository = officeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Roles pouvant recevoir des visiteurs (le secretariat et la securite ne sont pas des interlocuteurs). */
    private static final Set<EmployeeRole> VISITABLE_ROLES = Set.of(EmployeeRole.EMPLOYEE, EmployeeRole.ADMIN);

    /** Liste utilisee par la borne visiteur pour choisir la personne a rencontrer. */
    public List<EmployeeSummary> listSelectable() {
        return employeeRepository.findByActiveTrue().stream()
                .filter(e -> VISITABLE_ROLES.contains(e.getRole()))
                .map(e -> new EmployeeSummary(
                        e.getId(), e.getFullName(), e.getJobTitle(),
                        e.getDepartment() != null ? e.getDepartment().getName() : null,
                        e.getAvailability()))
                .toList();
    }

    public List<EmployeeDetail> listAll() {
        return employeeRepository.findAll().stream().map(this::toDetail).toList();
    }

    public EmployeeDetail get(UUID id) {
        return toDetail(findById(id));
    }

    public Employee findById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé introuvable"));
    }

    public EmployeeDetail create(EmployeeCreateRequest request) {
        Employee e = new Employee();
        e.setFirstName(request.firstName());
        e.setLastName(request.lastName());
        e.setJobTitle(request.jobTitle());
        e.setProfessionalPhone(request.professionalPhone());
        e.setProfessionalEmail(request.professionalEmail());
        String password = (request.password() == null || request.password().isBlank())
                ? UUID.randomUUID().toString()
                : request.password();
        e.setPasswordHash(passwordEncoder.encode(password));
        e.setRole(request.role() != null ? request.role() : EmployeeRole.EMPLOYEE);
        applyLocation(e, request.departmentId(), request.buildingId(), request.floorId(), request.officeId());
        return toDetail(employeeRepository.save(e));
    }

    public EmployeeDetail update(UUID id, EmployeeUpdateRequest request) {
        Employee e = findById(id);
        e.setFirstName(request.firstName());
        e.setLastName(request.lastName());
        e.setJobTitle(request.jobTitle());
        e.setProfessionalPhone(request.professionalPhone());
        e.setProfessionalEmail(request.professionalEmail());
        if (request.role() != null) e.setRole(request.role());
        if (request.availability() != null) e.setAvailability(request.availability());
        e.setActive(request.active());
        applyLocation(e, request.departmentId(), request.buildingId(), request.floorId(), request.officeId());
        return toDetail(employeeRepository.save(e));
    }

    public void delete(UUID id) {
        employeeRepository.deleteById(id);
    }

    public void updateAvailability(UUID id, EmployeeAvailability availability) {
        Employee e = findById(id);
        e.setAvailability(availability);
        employeeRepository.save(e);
    }

    private void applyLocation(Employee e, UUID departmentId, UUID buildingId, UUID floorId, UUID officeId) {
        e.setDepartment(departmentId != null
                ? departmentRepository.findById(departmentId).orElseThrow(() -> new ResourceNotFoundException("Département introuvable"))
                : null);
        e.setBuilding(buildingId != null
                ? buildingRepository.findById(buildingId).orElseThrow(() -> new ResourceNotFoundException("Bâtiment introuvable"))
                : null);
        e.setFloor(floorId != null
                ? floorRepository.findById(floorId).orElseThrow(() -> new ResourceNotFoundException("Étage introuvable"))
                : null);
        e.setOffice(officeId != null
                ? officeRepository.findById(officeId).orElseThrow(() -> new ResourceNotFoundException("Bureau introuvable"))
                : null);
    }

    private EmployeeDetail toDetail(Employee e) {
        return new EmployeeDetail(
                e.getId(), e.getFirstName(), e.getLastName(), e.getJobTitle(),
                e.getDepartment() != null ? e.getDepartment().getId() : null,
                e.getDepartment() != null ? e.getDepartment().getName() : null,
                e.getProfessionalPhone(), e.getProfessionalEmail(), e.getRole(),
                e.getBuilding() != null ? e.getBuilding().getId() : null,
                e.getFloor() != null ? e.getFloor().getId() : null,
                e.getOffice() != null ? e.getOffice().getId() : null,
                e.getLocationLabel(), e.getAvailability(), e.isActive()
        );
    }
}
