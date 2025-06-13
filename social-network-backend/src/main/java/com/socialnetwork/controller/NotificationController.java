package com.socialnetwork.controller;

import com.socialnetwork.model.notification.Notification;
import com.socialnetwork.response.ResponseObject;
import com.socialnetwork.service.NotificationService;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/msg")
public class NotificationController {

    @Resource
    private NotificationService notificationService;

    @GetMapping("/getNotifications")
    public ResponseObject getNotifications(Authentication authentication) {
        List<Notification> allNotifications = notificationService.getAllNotifications(authentication);
        return new ResponseObject(HttpStatus.OK.value(),
                "Get all notifications successfully", allNotifications);
    }

    @PostMapping("/markAsRead")
    @PreAuthorize("hasRole('USER') OR hasRole('ADMIN')")
    public ResponseObject markAsRead() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        notificationService.markAsRead(username);
        return new ResponseObject(HttpStatus.OK.value(),
                "Mark all notifications as read successfully", null);
    }
}
