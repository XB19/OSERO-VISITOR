package com.osero.visitor.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "visits")
@Getter
@Setter
@NoArgsConstructor
public class Visit {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "visitor_first_name", nullable = false, length = 80)
    private String visitorFirstName;

    @Column(name = "visitor_last_name", nullable = false, length = 80)
    private String visitorLastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VisitReason reason;

    @Column(name = "reason_detail", length = 255)
    private String reasonDetail;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VisitStatus status = VisitStatus.NOUVELLE_DEMANDE;

    @Column(name = "location_snapshot", length = 255)
    private String locationSnapshot;

    @Column(name = "refusal_reason", length = 255)
    private String refusalReason;

    @Column(name = "arrival_time", nullable = false)
    private Instant arrivalTime = Instant.now();

    @Column(name = "notified_at")
    private Instant notifiedAt;

    @Column(name = "responded_at")
    private Instant respondedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getVisitorFullName() {
        return visitorFirstName + " " + visitorLastName;
    }
}
