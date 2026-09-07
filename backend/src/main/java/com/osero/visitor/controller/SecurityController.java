package com.osero.visitor.controller;

import com.osero.visitor.dto.VisitDtos.VisitHistoryRow;
import com.osero.visitor.dto.VisitDtos.VisitStatusResponse;
import com.osero.visitor.service.VisitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/** Interface agent de securite : visiteurs presents et cloture des visites. */
@RestController
@RequestMapping("/api/security")
public class SecurityController {

    private final VisitService visitService;

    public SecurityController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping("/visits/active")
    public List<VisitHistoryRow> active() {
        return visitService.listActive();
    }

    @PostMapping("/visits/{id}/start")
    public VisitStatusResponse start(@PathVariable UUID id) {
        return visitService.markInProgress(id);
    }

    @PostMapping("/visits/{id}/close")
    public VisitHistoryRow close(@PathVariable UUID id) {
        return visitService.close(id);
    }
}
