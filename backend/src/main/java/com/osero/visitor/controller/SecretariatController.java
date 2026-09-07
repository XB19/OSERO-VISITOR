package com.osero.visitor.controller;

import com.osero.visitor.dto.VisitDtos.*;
import com.osero.visitor.service.VisitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** Interface secretariat : validation centralisee de toutes les demandes de visite. */
@RestController
@RequestMapping("/api/secretariat")
public class SecretariatController {

    private final VisitService visitService;

    public SecretariatController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping("/visits")
    public List<VisitRequestView> pendingVisits() {
        return visitService.listPending();
    }

    @PostMapping("/visits/{id}/accept")
    public VisitStatusResponse accept(@PathVariable UUID id, @RequestBody(required = false) AcceptRequest request) {
        return visitService.accept(id, request);
    }

    @PostMapping("/visits/{id}/wait")
    public VisitStatusResponse wait(@PathVariable UUID id) {
        return visitService.markWaiting(id);
    }

    @PostMapping("/visits/{id}/refuse")
    public VisitStatusResponse refuse(@PathVariable UUID id, @RequestBody(required = false) RefuseRequest request) {
        return visitService.refuse(id, request);
    }
}
