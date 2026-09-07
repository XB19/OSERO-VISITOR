package com.osero.visitor.service;

import com.osero.visitor.domain.Employee;
import com.osero.visitor.domain.Visit;
import com.osero.visitor.domain.VisitStatus;
import com.osero.visitor.dto.DashboardStatsResponse;
import com.osero.visitor.dto.VisitDtos.*;
import com.osero.visitor.exception.InvalidVisitStateException;
import com.osero.visitor.exception.ResourceNotFoundException;
import com.osero.visitor.repository.VisitRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VisitService {

    private static final List<VisitStatus> ACTIVE_STATUSES = List.of(
            VisitStatus.NOUVELLE_DEMANDE, VisitStatus.NOTIFICATION_ENVOYEE,
            VisitStatus.EN_ATTENTE, VisitStatus.ACCEPTEE, VisitStatus.EN_COURS);

    private static final List<VisitStatus> EMPLOYEE_PENDING_STATUSES = List.of(
            VisitStatus.NOUVELLE_DEMANDE, VisitStatus.NOTIFICATION_ENVOYEE, VisitStatus.EN_ATTENTE);

    private final VisitRepository visitRepository;
    private final EmployeeService employeeService;
    private final long escalationMinutes;

    public VisitService(VisitRepository visitRepository, EmployeeService employeeService,
                         @Value("${osero.visit.waiting-escalation-minutes}") long escalationMinutes) {
        this.visitRepository = visitRepository;
        this.employeeService = employeeService;
        this.escalationMinutes = escalationMinutes;
    }

    // ---- Borne visiteur ----

    public VisitStatusResponse create(VisitCreateRequest request) {
        Employee employee = employeeService.findById(request.employeeId());

        Visit visit = new Visit();
        visit.setVisitorFirstName(request.visitorFirstName());
        visit.setVisitorLastName(request.visitorLastName());
        visit.setReason(request.reason());
        visit.setReasonDetail(request.reasonDetail());
        visit.setEmployee(employee);
        visit.setStatus(VisitStatus.NOTIFICATION_ENVOYEE);
        visit.setArrivalTime(Instant.now());
        visit.setNotifiedAt(Instant.now());

        return toStatusResponse(visitRepository.save(visit));
    }

    public VisitStatusResponse getStatus(UUID id) {
        return toStatusResponse(findById(id));
    }

    // ---- Interface secretariat ----

    /** Toutes les demandes en attente de validation, tous employes confondus. */
    public List<VisitRequestView> listPending() {
        return visitRepository
                .findByStatusInOrderByArrivalTimeAsc(EMPLOYEE_PENDING_STATUSES)
                .stream().map(this::toRequestView).toList();
    }

    public VisitStatusResponse accept(UUID visitId, AcceptRequest request) {
        Visit visit = findById(visitId);
        requirePendingStatus(visit);

        Employee employee = visit.getEmployee();
        String location = (request != null && request.locationOverride() != null && !request.locationOverride().isBlank())
                ? request.locationOverride()
                : employee.getLocationLabel();

        visit.setStatus(VisitStatus.ACCEPTEE);
        visit.setLocationSnapshot(location);
        visit.setRespondedAt(Instant.now());
        return toStatusResponse(visitRepository.save(visit));
    }

    public VisitStatusResponse markWaiting(UUID visitId) {
        Visit visit = findById(visitId);
        requirePendingStatus(visit);
        visit.setStatus(VisitStatus.EN_ATTENTE);
        return toStatusResponse(visitRepository.save(visit));
    }

    public VisitStatusResponse refuse(UUID visitId, RefuseRequest request) {
        Visit visit = findById(visitId);
        requirePendingStatus(visit);
        visit.setStatus(VisitStatus.REFUSEE);
        visit.setRefusalReason(request != null ? request.refusalReason() : null);
        visit.setRespondedAt(Instant.now());
        return toStatusResponse(visitRepository.save(visit));
    }

    // ---- Securite ----

    public List<VisitHistoryRow> listActive() {
        return visitRepository.findByStatusInOrderByArrivalTimeAsc(
                        List.of(VisitStatus.ACCEPTEE, VisitStatus.EN_COURS))
                .stream().map(this::toHistoryRow).toList();
    }

    public VisitHistoryRow close(UUID visitId) {
        Visit visit = findById(visitId);
        if (visit.getStatus() != VisitStatus.ACCEPTEE && visit.getStatus() != VisitStatus.EN_COURS) {
            throw new InvalidVisitStateException("Seule une visite acceptée ou en cours peut être clôturée");
        }
        visit.setStatus(VisitStatus.TERMINEE);
        visit.setClosedAt(Instant.now());
        return toHistoryRow(visitRepository.save(visit));
    }

    public VisitStatusResponse markInProgress(UUID visitId) {
        Visit visit = findById(visitId);
        if (visit.getStatus() != VisitStatus.ACCEPTEE) {
            throw new InvalidVisitStateException("Seule une visite acceptée peut démarrer");
        }
        visit.setStatus(VisitStatus.EN_COURS);
        return toStatusResponse(visitRepository.save(visit));
    }

    // ---- Admin / historique ----

    public List<VisitHistoryRow> history(Instant from, Instant to) {
        Instant start = from != null ? from : Instant.now().minus(30, ChronoUnit.DAYS);
        Instant end = to != null ? to : Instant.now();
        return visitRepository.findByArrivalTimeBetween(start, end).stream()
                .map(this::toHistoryRow).toList();
    }

    public DashboardStatsResponse dashboardStats() {
        Instant startOfDay = Instant.now().atZone(ZoneId.systemDefault())
                .toLocalDate().atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant now = Instant.now();

        long visitorsToday = visitRepository.countByArrivalTimeBetween(startOfDay, now);
        long completed = visitRepository.countByStatusAndArrivalTimeBetween(VisitStatus.TERMINEE, startOfDay, now);
        long refused = visitRepository.countByStatusAndArrivalTimeBetween(VisitStatus.REFUSEE, startOfDay, now);

        List<Visit> todayVisits = visitRepository.findByArrivalTimeBetween(startOfDay, now);
        long present = todayVisits.stream()
                .filter(v -> v.getStatus() == VisitStatus.ACCEPTEE || v.getStatus() == VisitStatus.EN_COURS)
                .count();
        long waiting = todayVisits.stream()
                .filter(v -> ACTIVE_STATUSES.contains(v.getStatus())
                        && v.getStatus() != VisitStatus.ACCEPTEE && v.getStatus() != VisitStatus.EN_COURS)
                .count();

        double avgWaitMinutes = todayVisits.stream()
                .filter(v -> v.getRespondedAt() != null)
                .mapToLong(v -> Duration.between(v.getArrivalTime(), v.getRespondedAt()).toSeconds())
                .average()
                .orElse(0.0) / 60.0;

        return new DashboardStatsResponse(visitorsToday, present, waiting, completed, refused, avgWaitMinutes);
    }

    // ---- Helpers ----

    private Visit findById(UUID id) {
        return visitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visite introuvable"));
    }

    private void requirePendingStatus(Visit visit) {
        if (!EMPLOYEE_PENDING_STATUSES.contains(visit.getStatus())) {
            throw new InvalidVisitStateException("Cette visite a déjà été traitée");
        }
    }

    private boolean isOverdue(Visit visit) {
        if (!EMPLOYEE_PENDING_STATUSES.contains(visit.getStatus())) return false;
        return Duration.between(visit.getArrivalTime(), Instant.now()).toMinutes() >= escalationMinutes;
    }

    private VisitStatusResponse toStatusResponse(Visit visit) {
        String message = switch (visit.getStatus()) {
            case NOUVELLE_DEMANDE, NOTIFICATION_ENVOYEE ->
                    "Votre demande est prise en compte. Votre interlocuteur a été informé.";
            case EN_ATTENTE ->
                    "Votre demande est prise en compte. Votre interlocuteur a été informé. Merci de patienter quelques instants.";
            case ACCEPTEE, EN_COURS ->
                    "Visite confirmée. Vous êtes attendu par " + visit.getEmployee().getFullName()
                            + ". " + visit.getLocationSnapshot();
            case REFUSEE ->
                    "Votre interlocuteur n'est actuellement pas disponible. Merci de vous rapprocher de l'accueil.";
            case TERMINEE -> "Visite terminée. Merci de votre visite.";
            case ANNULEE -> "Demande annulée.";
        };

        return new VisitStatusResponse(
                visit.getId(), visit.getStatus(), visit.getVisitorFullName(),
                visit.getEmployee().getFullName(), visit.getLocationSnapshot(), message, isOverdue(visit));
    }

    private VisitRequestView toRequestView(Visit visit) {
        Employee employee = visit.getEmployee();
        return new VisitRequestView(
                visit.getId(), visit.getVisitorFullName(), visit.getReason(), visit.getReasonDetail(),
                employee.getFullName(), employee.getJobTitle(), employee.getProfessionalPhone(),
                visit.getStatus(), visit.getArrivalTime(), isOverdue(visit));
    }

    private VisitHistoryRow toHistoryRow(Visit visit) {
        Long waitSeconds = visit.getRespondedAt() != null
                ? Duration.between(visit.getArrivalTime(), visit.getRespondedAt()).toSeconds() : null;
        Long durationSeconds = visit.getClosedAt() != null
                ? Duration.between(visit.getArrivalTime(), visit.getClosedAt()).toSeconds() : null;

        return new VisitHistoryRow(
                visit.getId(), visit.getVisitorFullName(), visit.getEmployee().getFullName(),
                visit.getReason(), visit.getStatus(), visit.getLocationSnapshot(),
                visit.getArrivalTime(), visit.getRespondedAt(), visit.getClosedAt(),
                waitSeconds, durationSeconds);
    }
}
