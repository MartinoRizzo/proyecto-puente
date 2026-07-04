package io.proyectopuente.backend.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "simulation_sessions")
public class SimulationSessionJpaEntity {

    @Id
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "simulation_date", nullable = false)
    private LocalDate simulationDate;

    @Column(name = "current_hour", nullable = false)
    private int currentHour;

    @Column(name = "current_day_of_sprint", nullable = false)
    private int currentDayOfSprint;

    @Column(name = "total_sprint_days", nullable = false)
    private int totalSprintDays;

    @Column(name = "active", nullable = false)
    private boolean active;

    public SimulationSessionJpaEntity() {}

    public SimulationSessionJpaEntity(
            UUID id,
            UUID userId,
            UUID companyId,
            LocalDate startDate,
            LocalDate simulationDate,
            int currentHour,
            int currentDayOfSprint,
            int totalSprintDays,
            boolean active) {
        this.id = id;
        this.userId = userId;
        this.companyId = companyId;
        this.startDate = startDate;
        this.simulationDate = simulationDate;
        this.currentHour = currentHour;
        this.currentDayOfSprint = currentDayOfSprint;
        this.totalSprintDays = totalSprintDays;
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public void setCompanyId(UUID companyId) {
        this.companyId = companyId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getSimulationDate() {
        return simulationDate;
    }

    public void setSimulationDate(LocalDate simulationDate) {
        this.simulationDate = simulationDate;
    }

    public int getCurrentHour() {
        return currentHour;
    }

    public void setCurrentHour(int currentHour) {
        this.currentHour = currentHour;
    }

    public int getCurrentDayOfSprint() {
        return currentDayOfSprint;
    }

    public void setCurrentDayOfSprint(int currentDayOfSprint) {
        this.currentDayOfSprint = currentDayOfSprint;
    }

    public int getTotalSprintDays() {
        return totalSprintDays;
    }

    public void setTotalSprintDays(int totalSprintDays) {
        this.totalSprintDays = totalSprintDays;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
