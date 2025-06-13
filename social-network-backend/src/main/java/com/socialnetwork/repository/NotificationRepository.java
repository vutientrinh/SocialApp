package com.socialnetwork.repository;

import com.socialnetwork.model.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    @Query("SELECT n FROM Notification n WHERE n.receiver.UUID = :UUID")
    List<Notification> getAllNotifications(String UUID);

    @Query("SELECT n FROM Notification n WHERE n.receiver.UUID = :UUID AND n.unread = true")
    List<Notification> getUnreadNotifications(String UUID);
}
