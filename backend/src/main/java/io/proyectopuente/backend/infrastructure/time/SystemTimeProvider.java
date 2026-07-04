package io.proyectopuente.backend.infrastructure.time;

import io.proyectopuente.backend.domain.shared.time.TimeProvider;
import java.time.Instant;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class SystemTimeProvider implements TimeProvider {

    @Override
    public Instant now() {
        return Instant.now();
    }

    @Override
    public LocalDate currentDate() {
        return LocalDate.now();
    }
}
