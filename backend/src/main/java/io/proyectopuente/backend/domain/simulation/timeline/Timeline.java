package io.proyectopuente.backend.domain.simulation.timeline;

import java.time.LocalDate;
import java.util.Objects;

public record Timeline(
    LocalDate startDate,
    LocalDate currentDate,
    int currentHour, // Virtual hour of the day (e.g., 9 to 18)
    int currentDayOfSprint,
    int totalSprintDays
) {
    public Timeline {
        Objects.requireNonNull(startDate, "Start date cannot be null");
        Objects.requireNonNull(currentDate, "Current date cannot be null");
        if (currentHour < 0 || currentHour > 23) {
            throw new IllegalArgumentException("Virtual hour must be between 0 and 23");
        }
        if (currentDayOfSprint < 1) {
            throw new IllegalArgumentException("Current day of sprint must be >= 1");
        }
        if (totalSprintDays < 1) {
            throw new IllegalArgumentException("Total sprint days must be >= 1");
        }
    }

    public static Timeline init(LocalDate start, int totalSprintDays) {
        return new Timeline(start, start, 9, 1, totalSprintDays);
    }

    public Timeline advanceHours(int hours) {
        int newHour = this.currentHour + hours;
        int daysToAdvance = 0;
        
        while (newHour >= 18) { // End of virtual work day at 18:00
            newHour = 9 + (newHour - 18);
            daysToAdvance++;
        }

        if (daysToAdvance == 0) {
            return new Timeline(this.startDate, this.currentDate, newHour, this.currentDayOfSprint, this.totalSprintDays);
        }

        LocalDate newDate = this.currentDate;
        int newDayOfSprint = this.currentDayOfSprint;
        
        for (int i = 0; i < daysToAdvance; i++) {
            newDate = newDate.plusDays(1);
            // Skip weekends for virtual office time
            while (isWeekend(newDate)) {
                newDate = newDate.plusDays(1);
            }
            newDayOfSprint++;
        }

        return new Timeline(
            this.startDate,
            newDate,
            newHour,
            Math.min(this.totalSprintDays, newDayOfSprint),
            this.totalSprintDays
        );
    }

    public boolean isSprintFinished() {
        return currentDayOfSprint >= totalSprintDays && currentHour >= 18;
    }

    private static boolean isWeekend(LocalDate date) {
        var day = date.getDayOfWeek();
        return day == java.time.DayOfWeek.SATURDAY || day == java.time.DayOfWeek.SUNDAY;
    }
}
