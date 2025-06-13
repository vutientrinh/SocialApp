package com.socialnetwork.service;

import com.socialnetwork.dtos.Responses.ChatResponse;
import com.socialnetwork.model.conversation.ChatMessage;
import com.socialnetwork.model.conversation.Thread;
import com.socialnetwork.repository.ChatMessageRepository;
import com.socialnetwork.repository.ThreadRepository;
import com.socialnetwork.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ThreadRepository threadRepository;
    private final UserRepository userRepository;

    public ChatMessage saveMessage(ChatMessage chatMessage) {
        System.out.print(chatMessage);
        ChatMessage existingMessage = chatMessageRepository.findMessagesBetweenUsers(
                chatMessage.getSenderUUID().getUUID(),
                chatMessage.getReceiverUUID().getUUID()
        );
        Thread newThread = new Thread();
        System.out.print(existingMessage);

        if (existingMessage != null) {
            newThread.setChatMessageUUID(existingMessage);
            newThread.setSenderUUID(chatMessage.getSenderUUID().getUUID());
            newThread.setContent(chatMessage.getThreads().get(chatMessage.getThreads().size() - 1).getContent());
            newThread.setTimeStamps(LocalDateTime.now());
            threadRepository.save(newThread);
            existingMessage.getThreads().add(newThread);
            existingMessage.setLastUploadedAt(LocalDateTime.now());
            chatMessageRepository.save(existingMessage);
            System.out.print("Them thread moi");
            return existingMessage;
        } else {
            // Create a new ChatMessage
            ChatMessage newChat = new ChatMessage();
            newChat.setReceiverUUID(chatMessage.getReceiverUUID());
            newChat.setSenderUUID(chatMessage.getSenderUUID());
            newChat.setLastUploadedAt(LocalDateTime.now());

            newThread.setChatMessageUUID(newChat); // Link the thread to the new chat
            newThread.setSenderUUID(chatMessage.getSenderUUID().getUUID()); // Set sender UUID
            newThread.setContent(chatMessage.getThreads().get(chatMessage.getThreads().size() - 1).getContent());
            newThread.setTimeStamps(LocalDateTime.now());

// Add the new thread to the chat
            List<Thread> threads = new ArrayList<>();
            threads.add(newThread);
            newChat.setThreads(threads);

// Save the new chat
            chatMessageRepository.save(newChat);

            System.out.println("New chat created successfully");
            return newChat;

        }
    }
    @Transactional
    public ChatResponse getChatMessage(
            String senderId,
            String receiverId
    ) {
        ChatMessage existingMessage = chatMessageRepository.findMessagesBetweenUsers(
                senderId,
                receiverId
        );
        if(existingMessage!=null){
            ChatResponse chatResponse = new ChatResponse();
            chatResponse.setSenderUUID(existingMessage.getSenderUUID().getUUID());
            chatResponse.setReceiverUUID(existingMessage.getReceiverUUID().getUUID());
            chatResponse.setThreads(existingMessage.getThreads());
            System.out.print("Lay chat");
            return chatResponse;
        }
        return null;

    }
}
