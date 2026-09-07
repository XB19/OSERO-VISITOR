package com.osero.visitor.dto;

public record DashboardStatsResponse(
        long visitorsToday,
        long visitorsPresent,
        long visitsWaiting,
        long visitsCompleted,
        long visitsRefused,
        double averageWaitMinutes
) {}
