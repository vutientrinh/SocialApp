package com.socialnetwork.dtos.Responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ActiveUserResponse {
    private String firstName;
    private String lastName;
    private Boolean isOnline;
}
