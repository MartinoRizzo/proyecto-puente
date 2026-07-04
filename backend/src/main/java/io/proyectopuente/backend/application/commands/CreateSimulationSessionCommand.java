package io.proyectopuente.backend.application.commands;

import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.simulation.company.CompanyId;
import java.util.Objects;

public record CreateSimulationSessionCommand(
    UserId userId,
    CompanyId companyId,
    int sprintDays
) {
    public CreateSimulationSessionCommand {
        Objects.requireNonNull(userId, "UserId cannot be null");
        Objects.requireNonNull(companyId, "CompanyId cannot be null");
        if (sprintDays <= 0) {
            throw new IllegalArgumentException("Sprint days must be greater than zero");
        }
    }
}
