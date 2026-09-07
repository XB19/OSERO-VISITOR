package com.osero.visitor.dto;

import com.osero.visitor.domain.VisitReason;
import com.osero.visitor.domain.VisitStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public class VisitDtos {

    public record VisitCreateRequest(
            @NotBlank String visitorFirstName,
            @NotBlank String visitorLastName,
            @NotNull VisitReason reason,
            String reasonDetail,
            @NotNull UUID employeeId
    ) {}

    /** Etat renvoye a la borne (avant/apres reponse de l'employe). */
    public record VisitStatusResponse(
            UUID id,
            VisitStatus status,
            String visitorFullName,
            String employeeFullName,
            String locationSnapshot,
            String message,
            boolean overdue
    ) {}

    /** Vue secretariat d'une demande de visite en attente de validation. */
    public record VisitRequestView(
            UUID id,
            String visitorFullName,
            VisitReason reason,
            String reasonDetail,
            String employeeFullName,
            String employeeJobTitle,
            String employeePhone,
            VisitStatus status,
            Instant arrivalTime,
            boolean overdue
    ) {}

    public record AcceptRequest(
            String locationOverride
    ) {}

    public record RefuseRequest(
            String refusalReason
    ) {}

    /** Ligne d'historique pour l'administration / la securite. */
    public record VisitHistoryRow(
            UUID id,
            String visitorFullName,
            String employeeFullName,
            VisitReason reason,
            VisitStatus status,
            String locationSnapshot,
            Instant arrivalTime,
            Instant respondedAt,
            Instant closedAt,
            Long waitSeconds,
            Long durationSeconds
    ) {}
}
