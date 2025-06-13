package com.socialnetwork.dtos.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchUserRequest {
    private String keyword;
    private boolean status;
}
