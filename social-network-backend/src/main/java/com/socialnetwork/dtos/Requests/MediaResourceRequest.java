package com.socialnetwork.dtos.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MediaResourceRequest {
    private String fileName;
    private String fileType;
    private boolean external;
    private String filePath;
    private Long fileSize;
    private String fileDescription;
    private String fileThumbnail;
    private boolean success;
}
