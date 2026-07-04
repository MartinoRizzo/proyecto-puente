package io.proyectopuente.backend.domain.shared.time;

import java.time.Instant;
import java.time.LocalDate;

public interface TimeProvider {
    Instant now();
    LocalDate currentDate();
}
