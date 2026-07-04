package io.proyectopuente.backend.domain.shared.model;

import java.util.Objects;
import java.util.regex.Pattern;

public record EmailAddress(String value) {
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    public EmailAddress {
        Objects.requireNonNull(value, "Email value cannot be null");
        String normalized = value.trim().toLowerCase();
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid email format: " + value);
        }
        value = normalized;
    }

    public static EmailAddress from(String email) {
        return new EmailAddress(email);
    }
}
