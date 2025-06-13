package com.socialnetwork.model.filters;

import com.socialnetwork.model.enums.EFileType;
import com.socialnetwork.model.enums.EGender;
import com.socialnetwork.model.enums.EStatusPost;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FilterModel {
    // User can filter posts by Gender, Age, Location, and Birthday
    private Boolean isActive;
    private EGender gender;
    private String dateOfBirth;
    private String phoneNumber;

    // Post can be filtered by the user who posted it,
    // the date it was posted,
    // and the location it was posted from
    private EStatusPost status;
    private String createdDateAt;


    // File can be filtered by the user who uploaded it,
    // the date it was uploaded,
    // and the location it was uploaded from
    private LocalDateTime uploadedDateAt;
    private EFileType fileType;
    private boolean isExternal;
}
