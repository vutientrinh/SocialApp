package com.socialnetwork.dtos.Requests;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContentRequest {
    private String message;
    private MediaResourceRequest fileUUID;
    private List<ImageRequest> imageURLs;
}
