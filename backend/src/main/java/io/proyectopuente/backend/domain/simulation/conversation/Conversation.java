package io.proyectopuente.backend.domain.simulation.conversation;

import io.proyectopuente.backend.domain.simulation.SimulationSessionId;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class Conversation {
    private final ConversationId id;
    private final SimulationSessionId sessionId;
    private final List<Participant> participants;
    // initial list of messages for MVP, designed to support pagination in infrastructure later
    private final List<Message> messages;

    public Conversation(
        ConversationId id,
        SimulationSessionId sessionId,
        List<Participant> participants,
        List<Message> messages
    ) {
        this.id = Objects.requireNonNull(id, "Conversation ID cannot be null");
        this.sessionId = Objects.requireNonNull(sessionId, "Simulation session ID cannot be null");
        this.participants = new ArrayList<>(Objects.requireNonNull(participants, "Participants list cannot be null"));
        this.messages = new ArrayList<>(Objects.requireNonNull(messages, "Messages list cannot be null"));
    }

    public static Conversation startNew(ConversationId id, SimulationSessionId sessionId) {
        return new Conversation(id, sessionId, new ArrayList<>(), new ArrayList<>());
    }

    public ConversationId getId() {
        return id;
    }

    public SimulationSessionId getSessionId() {
        return sessionId;
    }

    public List<Participant> getParticipants() {
        return Collections.unmodifiableList(participants);
    }

    public List<Message> getMessages() {
        return Collections.unmodifiableList(messages);
    }

    public void addParticipant(Participant participant) {
        Objects.requireNonNull(participant, "Participant cannot be null");
        if (participants.stream().anyMatch(p -> p.name().equals(participant.name()))) {
            return; // Already participating
        }
        this.participants.add(participant);
    }

    public Message postMessage(MessageId messageId, Participant sender, String content, Instant sentAt) {
        Objects.requireNonNull(sender, "Sender cannot be null");
        Objects.requireNonNull(content, "Content cannot be null");
        Objects.requireNonNull(sentAt, "Sent at timestamp cannot be null");

        // Validate that sender is part of this conversation
        boolean isParticipant = participants.stream()
            .anyMatch(p -> Objects.equals(p.userId(), sender.userId()) && Objects.equals(p.actorId(), sender.actorId()));
        
        if (!isParticipant) {
            throw new IllegalStateException("Only active participants can post messages to this conversation");
        }

        Message newMessage = new Message(messageId, sender, content, sentAt);
        this.messages.add(newMessage);
        return newMessage;
    }
}
