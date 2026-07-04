package io.proyectopuente.backend.infrastructure.web.dto;

import java.util.UUID;

public record CreateSessionRequest(
    UUID userId,
    UUID companyId,
    int sprintDays
) {}
