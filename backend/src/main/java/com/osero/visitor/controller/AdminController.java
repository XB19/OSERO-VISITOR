package com.osero.visitor.controller;

import com.osero.visitor.dto.DashboardStatsResponse;
import com.osero.visitor.dto.EmployeeDtos.*;
import com.osero.visitor.dto.LocationDtos.*;
import com.osero.visitor.dto.VisitDtos.VisitHistoryRow;
import com.osero.visitor.service.EmployeeService;
import com.osero.visitor.service.LocationService;
import com.osero.visitor.service.VisitService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EmployeeService employeeService;
    private final LocationService locationService;
    private final VisitService visitService;

    public AdminController(EmployeeService employeeService, LocationService locationService, VisitService visitService) {
        this.employeeService = employeeService;
        this.locationService = locationService;
        this.visitService = visitService;
    }

    @GetMapping("/dashboard")
    public DashboardStatsResponse dashboard() {
        return visitService.dashboardStats();
    }

    @GetMapping("/visits/history")
    public List<VisitHistoryRow> history(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return visitService.history(from, to);
    }

    // -- Employes --

    @GetMapping("/employees")
    public List<EmployeeDetail> listEmployees() {
        return employeeService.listAll();
    }

    @GetMapping("/employees/{id}")
    public EmployeeDetail getEmployee(@PathVariable UUID id) {
        return employeeService.get(id);
    }

    @PostMapping("/employees")
    public EmployeeDetail createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
        return employeeService.create(request);
    }

    @PutMapping("/employees/{id}")
    public EmployeeDetail updateEmployee(@PathVariable UUID id, @Valid @RequestBody EmployeeUpdateRequest request) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/employees/{id}")
    public void deleteEmployee(@PathVariable UUID id) {
        employeeService.delete(id);
    }

    // -- Departements --

    @GetMapping("/departments")
    public List<DepartmentResponse> listDepartments() {
        return locationService.listDepartments();
    }

    @PostMapping("/departments")
    public DepartmentResponse createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return locationService.createDepartment(request);
    }

    @DeleteMapping("/departments/{id}")
    public void deleteDepartment(@PathVariable UUID id) {
        locationService.deleteDepartment(id);
    }

    // -- Batiments --

    @GetMapping("/buildings")
    public List<BuildingResponse> listBuildings() {
        return locationService.listBuildings();
    }

    @PostMapping("/buildings")
    public BuildingResponse createBuilding(@Valid @RequestBody BuildingRequest request) {
        return locationService.createBuilding(request);
    }

    @DeleteMapping("/buildings/{id}")
    public void deleteBuilding(@PathVariable UUID id) {
        locationService.deleteBuilding(id);
    }

    // -- Etages --

    @GetMapping("/floors")
    public List<FloorResponse> listFloors(@RequestParam(required = false) UUID buildingId) {
        return locationService.listFloors(buildingId);
    }

    @PostMapping("/floors")
    public FloorResponse createFloor(@Valid @RequestBody FloorRequest request) {
        return locationService.createFloor(request);
    }

    @DeleteMapping("/floors/{id}")
    public void deleteFloor(@PathVariable UUID id) {
        locationService.deleteFloor(id);
    }

    // -- Bureaux --

    @GetMapping("/offices")
    public List<OfficeResponse> listOffices(@RequestParam(required = false) UUID floorId) {
        return locationService.listOffices(floorId);
    }

    @PostMapping("/offices")
    public OfficeResponse createOffice(@Valid @RequestBody OfficeRequest request) {
        return locationService.createOffice(request);
    }

    @DeleteMapping("/offices/{id}")
    public void deleteOffice(@PathVariable UUID id) {
        locationService.deleteOffice(id);
    }
}
