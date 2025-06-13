package com.socialnetwork.model.json;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageJSON {
    private Map<String, String> success;
    private Map<String, String> failure;
    private Map<String, String> warning;
}
