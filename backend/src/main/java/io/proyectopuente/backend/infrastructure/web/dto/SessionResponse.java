package io.proyectopuente.backend.infrastructure.web.dto;

import io.proyectopuente.backend.domain.simulation.SimulationSession;
import java.time.LocalDate;
import java.util.UUID;

public record SessionResponse(
    UUID id,
    UUID userId,
    UUID companyId,
    LocalDate startDate,
    LocalDate currentDate,
    int currentHour,
    int currentDayOfSprint,
    int totalSprintDays,
    boolean active
) {
    public static SessionResponse fromDomain(SimulationSession session) {
        return new SessionResponse(
            session.getId().value(),
            session.getUserId().value(),
            session.getCompanyId().value(),
            session.getTimeline().startDate(),
            session.getTimeline().currentDate(),
            session.getTimeline().currentHour(),
            session.getTimeline().currentDayOfSprint(),
            session.getTimeline().totalSprintDays(),
            session.isActive()
        );
    }
}
