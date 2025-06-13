package com.socialnetwork.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class ResponseObject {

    @Builder.Default
    private int code = 200;

    private String message;
    private Object data;

    public ResponseObject(String message) {
        this.message = message;
    }
}
