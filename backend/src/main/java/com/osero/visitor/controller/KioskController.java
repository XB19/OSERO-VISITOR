package com.osero.visitor.controller;

import com.osero.visitor.domain.VisitReason;
import com.osero.visitor.dto.EmployeeDtos.EmployeeSummary;
import com.osero.visitor.dto.VisitDtos.VisitCreateRequest;
import com.osero.visitor.dto.VisitDtos.VisitStatusResponse;
import com.osero.visitor.service.EmployeeService;
import com.osero.visitor.service.VisitService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** Endpoints publics utilises par la borne visiteur (aucune authentification). */
@RestController
@RequestMapping("/api/kiosk")
public class KioskController {

    private final VisitService visitService;
    private final EmployeeService employeeService;

    public KioskController(VisitService visitService, EmployeeService employeeService) {
        this.visitService = visitService;
        this.employeeService = employeeService;
    }

    @GetMapping("/employees")
    public List<EmployeeSummary> employees() {
        return employeeService.listSelectable();
    }

    @GetMapping("/reasons")
    public List<VisitReason> reasons() {
        return List.of(VisitReason.values());
    }

    @PostMapping("/visits")
    public VisitStatusResponse createVisit(@Valid @RequestBody VisitCreateRequest request) {
        return visitService.create(request);
    }

    @GetMapping("/visits/{id}/status")
    public VisitStatusResponse status(@PathVariable UUID id) {
        return visitService.getStatus(id);
    }
}
