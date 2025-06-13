package com.socialnetwork.dtos.Responses;


import com.socialnetwork.model.conversation.Thread;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatResponse {
    private String senderUUID;
    private String receiverUUID;
    private List<Thread>threads;
}
