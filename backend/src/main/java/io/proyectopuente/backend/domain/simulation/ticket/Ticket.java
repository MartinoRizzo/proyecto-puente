package io.proyectopuente.backend.domain.simulation.ticket;

import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import io.proyectopuente.backend.domain.simulation.actor.ActorId;
import java.util.Objects;
import java.util.Optional;

public class Ticket {
    private final TicketId id;
    private final SimulationSessionId sessionId;
    private final String title;
    private final String description;
    private final int storyPoints;
    private ActorId assigneeId;
    private TicketStatus status;

    public Ticket(
        TicketId id,
        SimulationSessionId sessionId,
        String title,
        String description,
        int storyPoints,
        ActorId assigneeId,
        TicketStatus status
    ) {
        this.id = Objects.requireNonNull(id, "Ticket ID cannot be null");
        this.sessionId = Objects.requireNonNull(sessionId, "Simulation session ID cannot be null");
        this.title = Objects.requireNonNull(title, "Title cannot be null");
        this.description = Objects.requireNonNull(description, "Description cannot be null");
        this.storyPoints = storyPoints;
        this.assigneeId = assigneeId;
        this.status = Objects.requireNonNull(status, "Status cannot be null");
    }

    public static Ticket createNew(
        TicketId id,
        SimulationSessionId sessionId,
        String title,
        String description,
        int storyPoints
    ) {
        return new Ticket(id, sessionId, title, description, storyPoints, null, TicketStatus.BACKLOG);
    }

    public TicketId getId() {
        return id;
    }

    public SimulationSessionId getSessionId() {
        return sessionId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getStoryPoints() {
        return storyPoints;
    }

    public Optional<ActorId> getAssigneeId() {
        return Optional.ofNullable(assigneeId);
    }

    public TicketStatus getStatus() {
        return status;
    }

    // Domain Transitions

    public void moveTodo() {
        if (this.status != TicketStatus.BACKLOG) {
            throw new IllegalStateException("Ticket can only move to TODO from BACKLOG");
        }
        this.status = TicketStatus.TODO;
    }

    public void assignTo(ActorId actorId) {
        Objects.requireNonNull(actorId, "Assignee cannot be null");
        if (this.status == TicketStatus.BACKLOG) {
            this.status = TicketStatus.TODO;
        }
        this.assigneeId = actorId;
        this.status = TicketStatus.ASSIGNED;
    }

    public void startWork() {
        if (this.status != TicketStatus.ASSIGNED) {
            throw new IllegalStateException("Can only start work on an ASSIGNED ticket");
        }
        this.status = TicketStatus.IN_PROGRESS;
    }

    public void submitForReview() {
        if (this.status != TicketStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only submit for review when IN_PROGRESS");
        }
        this.status = TicketStatus.IN_REVIEW;
    }

    public void approve() {
        if (this.status != TicketStatus.IN_REVIEW) {
            throw new IllegalStateException("Can only approve when IN_REVIEW");
        }
        this.status = TicketStatus.APPROVED;
    }

    public void complete() {
        if (this.status != TicketStatus.APPROVED) {
            throw new IllegalStateException("Can only complete when APPROVED");
        }
        this.status = TicketStatus.DONE;
    }
}
