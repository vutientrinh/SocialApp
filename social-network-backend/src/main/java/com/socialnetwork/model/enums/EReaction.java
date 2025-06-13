package com.socialnetwork.model.enums;

import lombok.Getter;

@Getter
public enum EReaction {
    LIKE("like"),
    HAHA("haha"),
    WOW("wow"),
    SAD("sad"),
    ANGRY("angry"),
    LOVE("love");

    private final String value;

    EReaction(String value) {
        this.value = value;
    }
}
