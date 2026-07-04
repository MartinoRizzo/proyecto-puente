package io.proyectopuente.backend.domain.simulation.timeline;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

public class TimelineTest {

    @Test
    public void testTimelineInit() {
        LocalDate start = LocalDate.of(2026, 7, 1);
        Timeline timeline = Timeline.init(start, 10);

        assertEquals(start, timeline.startDate());
        assertEquals(start, timeline.simulationDate());
        assertEquals(9, timeline.currentHour());
        assertEquals(1, timeline.currentDayOfSprint());
        assertEquals(10, timeline.totalSprintDays());
        assertFalse(timeline.isSprintFinished());
    }

    @Test
    public void testAdvanceHoursWithinWorkday() {
        LocalDate start = LocalDate.of(2026, 7, 1);
        Timeline timeline = Timeline.init(start, 10);

        Timeline next = timeline.advanceHours(3);

        assertEquals(12, next.currentHour());
        assertEquals(1, next.currentDayOfSprint());
        assertEquals(start, next.simulationDate());
    }

    @Test
    public void testAdvanceHoursOverWorkdayTransitionsToNextDay() {
        LocalDate start = LocalDate.of(2026, 7, 1); // Wednesday
        Timeline timeline = Timeline.init(start, 10);

        // Advancing 10 hours should go from 9:00 to 19:00, which transitions to 10:00 of next day
        Timeline next = timeline.advanceHours(10);

        assertEquals(10, next.currentHour());
        assertEquals(2, next.currentDayOfSprint());
        assertEquals(start.plusDays(1), next.simulationDate());
    }
}
