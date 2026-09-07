package com.osero.visitor.repository;

import com.osero.visitor.domain.Visit;
import com.osero.visitor.domain.VisitStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, UUID> {

    List<Visit> findByStatusInOrderByArrivalTimeAsc(List<VisitStatus> statuses);

    List<Visit> findByArrivalTimeBetween(Instant from, Instant to);

    long countByArrivalTimeBetween(Instant from, Instant to);

    long countByStatusAndArrivalTimeBetween(VisitStatus status, Instant from, Instant to);

    List<Visit> findByStatusAndRespondedAtIsNullAndArrivalTimeBefore(VisitStatus status, Instant before);
}
