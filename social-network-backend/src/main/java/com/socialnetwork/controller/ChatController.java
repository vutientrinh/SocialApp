package com.socialnetwork.controller;


import com.socialnetwork.dtos.Responses.ChatResponse;
import com.socialnetwork.model.conversation.ChatMessage;
import com.socialnetwork.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.saveMessage(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverUUID().getUUID(),
                "/queue/messages/" + chatMessage.getSenderUUID().getUUID(),
                savedMsg
        );
        System.out.print("Send chat");
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<ChatResponse> getChatMessages(@PathVariable String senderId,
                                                        @PathVariable String receiverId) {
        return ResponseEntity
                .ok(chatMessageService.getChatMessage(senderId, receiverId));
    }
}