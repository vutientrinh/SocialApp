package com.socialnetwork.exception;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CannotCreateFileException extends Exception{
    private String fileName;

    public CannotCreateFileException (String message, String fileName) {
        super(message);
        this.fileName = fileName;
    }
}
