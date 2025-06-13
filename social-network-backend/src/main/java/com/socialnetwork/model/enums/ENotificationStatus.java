package com.socialnetwork.model.enums;

import lombok.Getter;

@Getter
public enum ENotificationStatus {
    UNREAD,
    READ,
    ARCHIVED,
    IGNORED,
    ERROR,
    EXPIRED,
    SENT
}

