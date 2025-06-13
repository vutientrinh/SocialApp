package com.socialnetwork.dtos.Requests;

import com.socialnetwork.model.news.Image;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NewPostRequest {
    private String fileUUID;
    private String message;
    private List<Image> imageURLs;
    private String status;
}
