package com.socialnetwork.dtos.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
    private String postUUID;
    private ContentRequest content;
}
