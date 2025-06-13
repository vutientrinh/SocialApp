package com.socialnetwork.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostDayCount {
    private String dayOfWeek;
    private Long count;

    public PostDayCount(Object[] result) {
        // Handle day of week
        if (result[0] instanceof Number) {
            int dayNum = ((Number) result[0]).intValue();
            this.dayOfWeek = getDayName(dayNum).trim();
        } else {
            try {
                int dayNum = Integer.parseInt(result[0].toString());
                this.dayOfWeek = getDayName(dayNum).trim();
            } catch (NumberFormatException e) {
                this.dayOfWeek = result[0].toString().trim();
            }
        }

        // Handle count
        if (result[1] instanceof Number) {
            this.count = ((Number) result[1]).longValue();
        } else {
            this.count = Long.parseLong(result[1].toString());
        }
    }

    private String getDayName(int dayNum) {
        String[] days = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        return days[dayNum].trim();
    }
}