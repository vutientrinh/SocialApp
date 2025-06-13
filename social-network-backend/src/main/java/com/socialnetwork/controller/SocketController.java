package com.socialnetwork.controller;

import com.socialnetwork.model.notification.Notification;
import com.socialnetwork.security.jwt.JwtUtils;
import com.socialnetwork.service.NotificationService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.List;

@Slf4j
@Controller
public class SocketController {

    @Resource
    private NotificationService notificationService;
    @Resource
    private JwtUtils jwtUtils;

    @MessageMapping("/broadcast")
    public void systemBroadcasting(@Payload Notification notification,
                                   Message<?> message) {
        log.info("Broadcasting WS notification with payload {}", notification);
        String sender = extractSenderFromMessage(message);
        notificationService.systemBroadcasting(notification, sender);
    }

    @MessageMapping("/private/{uuid}")
    public void privateNotification(@DestinationVariable String uuid,
                                    @Payload Notification notification,
                                    Message<?> message) {
        log.info("Sending WS notification to {} with payload {}", uuid, notification);
        String sender = extractSenderFromMessage(message);
        notificationService.privateNotification(uuid, sender, notification);
    }

    @MessageMapping("/broadcast/{uuids}")
    public void broadcastNotification(@DestinationVariable List<String> uuids,
                                      @Payload Notification notification,
                                      Message<?> message) {
        log.info("Broadcasting WS notification with payload {}", notification);
        String sender = extractSenderFromMessage(message);
        notificationService.broadcastNotification(uuids, sender, notification);
    }

    private String extractSenderFromMessage(Message<?> message) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String authHeader = (String) accessor.getSessionAttributes().get("Authorization");
        return jwtUtils.getNameFromJwtToken(authHeader.substring(7));
    }
}
