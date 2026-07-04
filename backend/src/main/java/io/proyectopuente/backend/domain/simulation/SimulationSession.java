package io.proyectopuente.backend.domain.simulation;

import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.simulation.company.CompanyId;
import io.proyectopuente.backend.domain.simulation.timeline.Timeline;
import java.time.LocalDate;
import java.util.Objects;

public class SimulationSession {
    private final SimulationSessionId id;
    private final UserId userId;
    private final CompanyId companyId;
    private Timeline timeline;
    private boolean active;

    public SimulationSession(
        SimulationSessionId id,
        UserId userId,
        CompanyId companyId,
        Timeline timeline,
        boolean active
    ) {
        this.id = Objects.requireNonNull(id, "SimulationSession ID cannot be null");
        this.userId = Objects.requireNonNull(userId, "User ID cannot be null");
        this.companyId = Objects.requireNonNull(companyId, "Company ID cannot be null");
        this.timeline = Objects.requireNonNull(timeline, "Timeline cannot be null");
        this.active = active;
    }

    public static SimulationSession startNew(
        SimulationSessionId id,
        UserId userId,
        CompanyId companyId,
        LocalDate startDate,
        int sprintDays
    ) {
        Timeline initialTimeline = Timeline.init(startDate, sprintDays);
        return new SimulationSession(id, userId, companyId, initialTimeline, true);
    }

    public SimulationSessionId getId() {
        return id;
    }

    public UserId getUserId() {
        return userId;
    }

    public CompanyId getCompanyId() {
        return companyId;
    }

    public Timeline getTimeline() {
        return timeline;
    }

    public boolean isActive() {
        return active;
    }

    public void advanceTime(int hours) {
        if (!active) {
            throw new IllegalStateException("Cannot advance time in an inactive simulation session");
        }
        this.timeline = this.timeline.advanceHours(hours);
    }

    public void completeSession() {
        this.active = false;
    }
}
