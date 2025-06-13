package com.socialnetwork.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EmailNotFoundException extends Exception {
    private String email;

    public EmailNotFoundException (String message, String email) {
        super(message);
        this.email = email;
    }
}
