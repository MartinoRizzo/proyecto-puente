package io.proyectopuente.backend.infrastructure.persistence;

import io.proyectopuente.backend.application.ports.SimulationSessionRepository;
import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.simulation.SimulationSession;
import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import io.proyectopuente.backend.domain.simulation.company.CompanyId;
import io.proyectopuente.backend.domain.simulation.timeline.Timeline;
import java.util.Objects;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class SimulationSessionRepositoryImpl implements SimulationSessionRepository {

    private final SimulationSessionSpringDataRepository springDataRepository;

    public SimulationSessionRepositoryImpl(SimulationSessionSpringDataRepository springDataRepository) {
        this.springDataRepository = Objects.requireNonNull(springDataRepository);
    }

    @Override
    public Optional<SimulationSession> findById(SimulationSessionId id) {
        return springDataRepository.findById(id.value())
                .map(this::toDomain);
    }

    @Override
    public Optional<SimulationSession> findActiveByUserId(UserId userId) {
        return springDataRepository.findByUserIdAndActive(userId.value(), true)
                .map(this::toDomain);
    }

    @Override
    public void save(SimulationSession session) {
        springDataRepository.save(toEntity(session));
    }

    private SimulationSession toDomain(SimulationSessionJpaEntity entity) {
        return new SimulationSession(
                SimulationSessionId.from(entity.getId()),
                UserId.from(entity.getUserId()),
                CompanyId.from(entity.getCompanyId()),
                new Timeline(
                        entity.getStartDate(),
                        entity.getCurrentDate(),
                        entity.getCurrentHour(),
                        entity.getCurrentDayOfSprint(),
                        entity.getTotalSprintDays()
                ),
                entity.isActive()
        );
    }

    private SimulationSessionJpaEntity toEntity(SimulationSession domain) {
        return new SimulationSessionJpaEntity(
                domain.getId().value(),
                domain.getUserId().value(),
                domain.getCompanyId().value(),
                domain.getTimeline().startDate(),
                domain.getTimeline().currentDate(),
                domain.getTimeline().currentHour(),
                domain.getTimeline().currentDayOfSprint(),
                domain.getTimeline().totalSprintDays(),
                domain.isActive()
        );
    }
}
