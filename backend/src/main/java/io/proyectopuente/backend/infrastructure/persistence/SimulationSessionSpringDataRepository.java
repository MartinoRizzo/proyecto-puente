package io.proyectopuente.backend.infrastructure.persistence;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SimulationSessionSpringDataRepository extends JpaRepository<SimulationSessionJpaEntity, UUID> {
    Optional<SimulationSessionJpaEntity> findByUserIdAndActive(UUID userId, boolean active);
}
