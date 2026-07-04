package io.proyectopuente.backend.infrastructure.web.dto;

public record UserRegistrationRequest(
    String displayName,
    String email
) {}
