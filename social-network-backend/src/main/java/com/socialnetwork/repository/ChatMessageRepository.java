package com.socialnetwork.repository;

import com.socialnetwork.model.conversation.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,String>, JpaSpecificationExecutor<ChatMessage> {
    @Query("SELECT m FROM ChatMessage m WHERE (m.senderUUID.UUID = :senderId AND m.receiverUUID.UUID = :recipientId) OR (m.senderUUID.UUID = :recipientId AND m.receiverUUID.UUID = :senderId)")
    ChatMessage findMessagesBetweenUsers(@Param("senderId") String senderId, @Param("recipientId") String recipientId);
}
