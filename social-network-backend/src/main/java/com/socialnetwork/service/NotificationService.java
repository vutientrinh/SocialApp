package com.socialnetwork.service;

import com.socialnetwork.model.enums.ENotificationStatus;
import com.socialnetwork.model.notification.Notification;
import com.socialnetwork.model.user.User;
import com.socialnetwork.repository.NotificationRepository;
import com.socialnetwork.repository.UserRepository;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    @Resource
    private ProfileService profileService;

    public void privateNotification(String receiveId, String senderName, Notification notification) {
        log.info("Sending WS notification to {} with payload {}", receiveId, notification);
        Optional<User> sender = Optional.ofNullable(userRepository.findByUsername(senderName)
                .orElseThrow(() -> new RuntimeException("User not found")));
        Optional<User> receiver = Optional.ofNullable(userRepository.findByUUID(receiveId)
                .orElseThrow(() -> new RuntimeException("User not found")));

        // set sender and receiver
        notification.setSender(sender.get());
        notification.setReceiver(receiver.get());

        // set notification as unread and set the current time
        notification.setUnread(true);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus(ENotificationStatus.UNREAD);

        // add notification to sender and receiver
        sender.get().getSenderNotifications().add(notification);
        receiver.get().getReceiverNotifications().add(notification);
        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(receiveId, "/queue/private", notification);
    }

    public void systemBroadcasting(Notification notification, String senderName) {
        log.info("Broadcasting WS notification with payload {}", notification);
        notification = prepareNotification(notification, senderName);
        messagingTemplate.convertAndSend("/topic/broadcast", notification);
    }

    public void broadcastNotification(List<String> uuids, String senderName, Notification notification) {
        notification = prepareNotification(notification, senderName);
        for (String uuid : uuids) {
            log.info("Broadcasting WS notification to {} with payload {}", uuid, notification);
            messagingTemplate.convertAndSendToUser(uuid, "/queue/private", notification);
        }
    }

    private Notification prepareNotification(Notification notification, String senderName) {
        Optional<User> sender = Optional.ofNullable(userRepository.findByUsername(senderName)
                .orElseThrow(() -> new RuntimeException("User not found")));
        notification.setSender(sender.get());
        notification.setUnread(true);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setStatus(ENotificationStatus.UNREAD);
        return notification;
    }

    public List<Notification> getAllNotifications(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.getAllNotifications(user.getUUID());
    }

    public Boolean markAsRead(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // get all unread notifications
        List<Notification> notifications = notificationRepository.getUnreadNotifications(user.getUUID());
        for (Notification notification : notifications) {
            notification.setUnread(false);
            notification.setStatus(ENotificationStatus.READ);
            notificationRepository.save(notification);
        }
        return true;
    }
}

