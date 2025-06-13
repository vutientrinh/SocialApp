package com.socialnetwork.model.enums;

import lombok.Getter;

@Getter
public enum EStatusPost {
    PUBLIC,
    PRIVATE,
    FRIENDS,
    HIDDEN;

    public static EStatusPost fStatusPost(String type){
        return EStatusPost.valueOf(type.toUpperCase());
    }
}
