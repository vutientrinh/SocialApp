package com.socialnetwork.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshException extends RuntimeException {

    private final String token;
    private final String message;

    public TokenRefreshException(String token, String message) {
        this.token = token;
        this.message = message;
    }
}
