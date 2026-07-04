package io.proyectopuente.backend.infrastructure.web.controller;

import io.proyectopuente.backend.application.commands.CreateSimulationSessionCommand;
import io.proyectopuente.backend.application.handlers.CreateSimulationSessionCommandHandler;
import io.proyectopuente.backend.application.ports.SimulationSessionRepository;
import io.proyectopuente.backend.domain.identity.UserId;
import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import io.proyectopuente.backend.domain.simulation.company.CompanyId;
import io.proyectopuente.backend.infrastructure.web.dto.CreateSessionRequest;
import io.proyectopuente.backend.infrastructure.web.dto.SessionResponse;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulations")
public class SimulationSessionController {

    private final CreateSimulationSessionCommandHandler createHandler;
    private final SimulationSessionRepository sessionRepository;

    public SimulationSessionController(
            CreateSimulationSessionCommandHandler createHandler,
            SimulationSessionRepository sessionRepository) {
        this.createHandler = Objects.requireNonNull(createHandler);
        this.sessionRepository = Objects.requireNonNull(sessionRepository);
    }

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(@RequestBody CreateSessionRequest request) {
        CreateSimulationSessionCommand command = new CreateSimulationSessionCommand(
                UserId.from(request.userId()),
                CompanyId.from(request.companyId()),
                request.sprintDays()
        );

        SimulationSessionId sessionId = createHandler.handle(command);

        return sessionRepository.findById(sessionId)
                .map(session -> ResponseEntity.status(HttpStatus.CREATED).body(SessionResponse.fromDomain(session)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getSession(@PathVariable String id) {
        SimulationSessionId sessionId = SimulationSessionId.from(java.util.UUID.fromString(id));
        return sessionRepository.findById(sessionId)
                .map(session -> ResponseEntity.ok(SessionResponse.fromDomain(session)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
